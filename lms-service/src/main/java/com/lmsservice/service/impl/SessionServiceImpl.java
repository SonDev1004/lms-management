package com.lmsservice.service.impl;

import com.lmsservice.dto.request.GenerateSessionsRequest;
import com.lmsservice.dto.response.SessionInfoDTO;
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

    private List<Session> buildSessions(Course course, GenerateSessionsRequest req) {

        if (course.getStatus() == CourseStatus.IN_PROGRESS || course.getStatus() == CourseStatus.COMPLETED) {
            throw new AppException(ErrorCode.COURSE_ALREADY_STARTED);
        }

        // planned sessions: ưu tiên course snapshot, fallback subject
        Integer plannedFromCourse = course.getPlannedSession();
        Integer plannedFromSubject = (course.getSubject() != null ? course.getSubject().getSessionNumber() : null);

        int totalSessions = (plannedFromCourse != null)
                ? plannedFromCourse
                : (plannedFromSubject != null ? plannedFromSubject : 0);

        if (totalSessions <= 0) throw new AppException(ErrorCode.INVALID_REQUEST);

        // check teacher (để preview/generate đều consistent)
        if (course.getTeacher() == null) throw new AppException(ErrorCode.COURSE_TEACHER_REQUIRED);

        List<CourseTimeslot> slots = timeslotRepository.findByCourseIdAndIsActiveTrue(course.getId());
        if (slots.isEmpty()) throw new AppException(ErrorCode.COURSE_NO_TIMESLOT);

        slots = slots.stream()
                .sorted(Comparator
                        .comparing(CourseTimeslot::getDayOfWeek)
                        .thenComparing(CourseTimeslot::getStartTime))
                .toList();

        LocalDate current = (req != null ? req.getStartDate() : null);
        if (current == null) current = course.getStartDate();

        // flow track/curriculum_order
        if (current == null) {
            if (course.getTrackCode() != null
                    && course.getCurriculumOrder() != null
                    && course.getCurriculumOrder() > 1) {

                Course prev = courseRepository
                        .findByTrackCodeAndCurriculumOrder(course.getTrackCode(), course.getCurriculumOrder() - 1)
                        .orElseThrow(() -> new AppException(ErrorCode.PREVIOUS_COURSE_NOT_FOUND));

                LocalDate last = sessionRepository.findMaxDateByCourseId(prev.getId())
                        .orElseThrow(() -> new AppException(ErrorCode.PREVIOUS_COURSE_NO_SESSIONS));

                current = last.plusDays(1);

            } else {
                throw new AppException(ErrorCode.COURSE_START_DATE_REQUIRED);
            }
        }

        List<Session> result = new ArrayList<>();
        int order = 1;

        while (order <= totalSessions) {
            int currentDow = current.getDayOfWeek().getValue(); // 1..7

            for (CourseTimeslot slot : slots) {
                if (slot.getDayOfWeek() != null && slot.getDayOfWeek() == currentDow) {
                    if (order > totalSessions) break;

                    // conflict checks
                    boolean teacherConflict = sessionRepository.existsTeacherConflict(
                            course.getTeacher().getId(),
                            current,
                            slot.getStartTime(),
                            slot.getEndTime()
                    );
                    if (teacherConflict) throw new AppException(ErrorCode.TEACHER_BUSY);

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

                    result.add(s);
                }
            }

            current = current.plusDays(1);
        }

        return result;
    }

    @Override
    @Transactional
    public void generateSessionsForCourse(Long courseId, GenerateSessionsRequest req) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        List<Session> toSave = buildSessions(course, req);

        sessionRepository.deleteByCourseId(courseId);
        sessionRepository.saveAll(toSave);

        if (!toSave.isEmpty()) {
            course.setStartDate(toSave.getFirst().getDate());
            courseRepository.save(course);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionInfoDTO> previewSessionsForCourse(Long courseId, GenerateSessionsRequest req) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        List<Session> preview = buildSessions(course, req);

        return preview.stream()
                .map(s -> SessionInfoDTO.builder()
                        .id(null)
                        .order(s.getOrderSession())
                        .date(s.getDate() != null ? s.getDate().toString() : null)
                        .starttime(s.getStartTime() != null ? s.getStartTime().toString().substring(0, 5) : null)
                        .endtime(s.getEndTime() != null ? s.getEndTime().toString().substring(0, 5) : null)
                        .room(s.getRoom() != null ? s.getRoom().getName() : null)
                        .status(s.getStatus())
                        .studentCount(0L)
                        .build())
                .toList();
    }

}
