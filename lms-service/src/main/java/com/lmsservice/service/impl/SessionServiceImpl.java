package com.lmsservice.service.impl;

import com.lmsservice.dto.request.GenerateSessionsRequest;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.CourseTimeslot;
import com.lmsservice.entity.Room;
import com.lmsservice.entity.Session;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.CourseTimeslotRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.service.SessionService;
import com.lmsservice.util.CourseStatus;
import com.lmsservice.util.SessionStatus;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class SessionServiceImpl implements SessionService {


    SessionRepository sessionRepository;
    CourseRepository courseRepository;
    CourseTimeslotRepository timeslotRepository;

    private boolean isOnlineRoom(Room room) {
        if (room == null) return false;
        String name = room.getName();
        String location = room.getLocation();

        boolean byName = name != null && name.trim().equalsIgnoreCase("Online");
        boolean byLocation = location != null && location.toLowerCase().contains("online");
        return byName || byLocation;
    }
    @Override
    @Transactional
    public void generateSessionsForCourse(Long courseId, GenerateSessionsRequest req) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        if (course.getStatus() == CourseStatus.IN_PROGRESS || course.getStatus() == CourseStatus.COMPLETED) {
            throw new AppException(ErrorCode.COURSE_ALREADY_STARTED);
        }

        int planned = course.getPlannedSession() != null
                ? course.getPlannedSession()
                : (course.getSubject() != null ? course.getSubject().getSessionNumber() : 0);

        if (planned <= 0) throw new AppException(ErrorCode.INVALID_REQUEST);

        int totalSessions = planned;

        if (req != null && req.getTotalSessions() != null) {
            int v = req.getTotalSessions();
            if (v < 1 || v > planned) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
            totalSessions = v;
        }


        List<CourseTimeslot> slots = timeslotRepository.findByCourseIdAndIsActiveTrue(courseId);
        if (slots.isEmpty()) throw new AppException(ErrorCode.COURSE_NO_TIMESLOT);

        slots = slots.stream()
                .sorted(Comparator
                        .comparing(CourseTimeslot::getDayOfWeek)
                        .thenComparing(CourseTimeslot::getStartTime))
                .toList();

        LocalDate current = (req != null && req.getStartDate() != null)
                ? req.getStartDate()
                : course.getStartDate();

        if (current == null) {
            // áp dụng cho flow tuần tự theo track + curriculum_order
            if (course.getTrackCode() != null
                    && course.getCurriculumOrder() != null
                    && course.getCurriculumOrder() > 1) {

                Course prev = courseRepository
                        .findByTrackCodeAndCurriculumOrder(
                                course.getTrackCode(),
                                course.getCurriculumOrder() - 1
                        )
                        .orElseThrow(() -> new AppException(ErrorCode.PREVIOUS_COURSE_NOT_FOUND));

                LocalDate last = sessionRepository.findMaxDateByCourseId(prev.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.PREVIOUS_COURSE_NO_SESSIONS));

                current = last.plusDays(1);
                course.setStartDate(current);
                courseRepository.save(course);

            } else {
                throw new AppException(ErrorCode.COURSE_START_DATE_REQUIRED);
            }
        }


        sessionRepository.deleteByCourseId(courseId);

        List<Session> toSave = new ArrayList<>();
        int order = 1;

        while (order <= totalSessions) {
            int currentDow = current.getDayOfWeek().getValue(); // 1..7

            for (CourseTimeslot slot : slots) {
                if (slot.getDayOfWeek() != null && slot.getDayOfWeek() == currentDow) {

                    if (order > totalSessions) break;

                    // CHECK TRÙNG GIÁO VIÊN
                    boolean teacherConflict = sessionRepository.existsTeacherConflict(
                            course.getTeacher().getId(),
                            current,
                            slot.getStartTime(),
                            slot.getEndTime()
                    );
                    if (teacherConflict) throw new AppException(ErrorCode.TEACHER_BUSY);

                    // CHECK TRÙNG PHÒNG (chỉ khi slot có room)
                    Room room = slot.getRoom();
                    if (room != null && !isOnlineRoom(room)) {
                        boolean roomConflict = sessionRepository.existsRoomConflict(
                                room.getId(),
                                current,
                                slot.getStartTime(),
                                slot.getEndTime()
                        );
                        if (roomConflict) throw new AppException(ErrorCode.ROOM_BUSY);
                    }
                    Session s = new Session();
                    s.setCourse(course);
                    s.setOrderSession((short) order++);
                    s.setDate(current);
                    s.setStartTime(slot.getStartTime());
                    s.setEndTime(slot.getEndTime());
                    s.setTimeslot(slot);
                    s.setRoom(slot.getRoom());

                    s.setStatus(SessionStatus.SCHEDULED.ordinal());

                    toSave.add(s);
                }
            }

            current = current.plusDays(1);
        }

        sessionRepository.saveAll(toSave);

        if (!toSave.isEmpty()) {
            course.setStartDate(toSave.getFirst().getDate());
            courseRepository.save(course);
        }
    }
}
