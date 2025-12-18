package com.lmsservice.service.impl;

import com.lmsservice.dto.response.ScheduleItemDTO;
import com.lmsservice.entity.*;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.ScheduleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScheduleServiceImpl implements ScheduleService {

    SessionRepository sessionRepository;
    CurrentUserService currentUserService;
    CourseStudentRepository courseStudentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleItemDTO> getTeacherSchedule(LocalDate from, LocalDate to) {
        Long teacherId = currentUserService.requireTeacherId();
        List<Session> sessions = sessionRepository.findForTeacherBetween(teacherId, from, to);
        return sessions.stream().map(this::toDtoForTeacher).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleItemDTO> getStudentSchedule(LocalDate from, LocalDate to) {
        Long studentId = currentUserService.requireStudentId();

        List<Session> sessions =
                sessionRepository.findForStudentBetween(studentId, from, to);

        return sessions.stream()
                .map(this::toDtoForStudent)
                .toList();
    }

    @Override
    public List<ScheduleItemDTO> getAcademySchedule(LocalDate from, LocalDate to) {
        List<Session> sessions = sessionRepository.findAllBetween(from, to);

        return sessions.stream()
                .map(this::toScheduleItem)
                .toList();
    }
    private ScheduleItemDTO toScheduleItem(Session s) {
        Course c = s.getCourse();
        Subject subj = c.getSubject();
        Room r = s.getRoom();
        Teacher t = c.getTeacher();
        User tu = t != null ? t.getUser() : null;

        String teacherName = (tu != null)
                ? (tu.getFirstName() + " " + tu.getLastName()).trim()
                : null;

        return ScheduleItemDTO.builder()
                .sessionId(s.getId())
                .date(s.getDate())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .courseId(c.getId())
                .courseTitle(c.getTitle())
                .subjectTitle(subj != null ? subj.getTitle() : null)
                .roomName(r != null ? r.getName() : null)
                .roomLocation(r != null ? r.getLocation() : null)
                .teacherName(teacherName)
                .build();
    }

    private ScheduleItemDTO toDtoForTeacher(Session s) {
        Course c = s.getCourse();
        Subject subj = c.getSubject();
        Room r = s.getRoom();

        return ScheduleItemDTO.builder().sessionId(s.getId()).date(s.getDate()).startTime(s.getStartTime()).endTime(s.getEndTime()).courseId(c.getId()).courseTitle(c.getTitle()).subjectTitle(subj != null ? subj.getTitle() : null).roomName(r != null ? r.getName() : null).roomLocation(r != null ? r.getLocation() : null).build();
    }

    private ScheduleItemDTO toDtoForStudent(Session s) {
        Course c = s.getCourse();
        Subject subj = c.getSubject();
        Room r = s.getRoom();
        Teacher t = c.getTeacher();
        User tu = t != null ? t.getUser() : null;

        String teacherName = (tu != null) ? (tu.getFirstName() + " " + tu.getLastName()) : null;

        return ScheduleItemDTO.builder().sessionId(s.getId()).date(s.getDate()).startTime(s.getStartTime()).endTime(s.getEndTime()).courseId(c.getId()).courseTitle(c.getTitle()).subjectTitle(subj != null ? subj.getTitle() : null).roomName(r != null ? r.getName() : null).roomLocation(r != null ? r.getLocation() : null).teacherName(teacherName).build();
    }
}
