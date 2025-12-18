package com.lmsservice.service.impl;

import com.lmsservice.dto.request.course.CourseTimeslotRequest;
import com.lmsservice.dto.response.CourseTimeslotResponse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.CourseTimeslot;
import com.lmsservice.entity.Room;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.CourseTimeslotRepository;
import com.lmsservice.repository.RoomRepository;
import com.lmsservice.service.CourseTimeslotService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class CourseTimeslotServiceImpl implements CourseTimeslotService {

    CourseRepository courseRepository;
    CourseTimeslotRepository timeslotRepository;
    RoomRepository roomRepository;

    @Override
    @Transactional
    public void replaceTimeslots(Long courseId, List<CourseTimeslotRequest> requests) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        timeslotRepository.deleteByCourseId(courseId);

        timeslotRepository.flush();

        List<CourseTimeslot> entities = new ArrayList<>();
        if (requests == null) requests = List.of();

        for (CourseTimeslotRequest r : requests) {
            CourseTimeslot ts = new CourseTimeslot();
            ts.setCourse(course);
            ts.setDayOfWeek(r.getDayOfWeek());
            ts.setStartTime(r.getStartTime());
            ts.setEndTime(r.getEndTime());
            ts.setIsActive(r.getIsActive() == null || r.getIsActive());
            ts.setNote(r.getNote());

            if (r.getRoomId() != null) {
                Room room = roomRepository.findById(r.getRoomId())
                        .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
                ts.setRoom(room);
            } else {
                ts.setRoom(null);
            }

            entities.add(ts);
        }

        timeslotRepository.saveAll(entities);
    }

    @Override
    public List<CourseTimeslotResponse> getTimeslots(Long courseId) {
        courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        return timeslotRepository.findByCourseIdOrderByDayOfWeekAscStartTimeAsc(courseId)
                .stream()
                .map(ts -> new CourseTimeslotResponse(
                        ts.getId(),
                        ts.getDayOfWeek(),
                        ts.getStartTime(),
                        ts.getEndTime(),
                        ts.getRoom() != null ? ts.getRoom().getId() : null,
                        ts.getRoom() != null ? ts.getRoom().getName() : null,
                        ts.getIsActive(),
                        ts.getNote()
                ))
                .toList();
    }
}
