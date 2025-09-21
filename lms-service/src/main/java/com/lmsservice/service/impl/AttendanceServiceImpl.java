package com.lmsservice.service.impl;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AttendanceSummaryDTO;
import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.dto.response.StudentInfoDTO;
import com.lmsservice.entity.CourseStudent;
import com.lmsservice.entity.Session;
import com.lmsservice.entity.Student;
import com.lmsservice.entity.User;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.service.AttendanceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final SessionRepository sessionRepository;
    private final CourseStudentRepository courseStudentRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<AttendanceItemDTO> getAttendanceByDate(Long courseId, LocalDate date) {
        Session session = sessionRepository
                .findByCourseIdAndDate(courseId, date)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        int order = session.getOrderSession();
        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);

        if (courseStudents.isEmpty()) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }

        return courseStudents.stream()
                .map(cs -> {
                    Student st = cs.getStudent();
                    User u = st.getUser();
                    Integer attendance = null;
                    try {
                        List<Integer> list =
                                objectMapper.readValue(cs.getAttendanceList(), new TypeReference<List<Integer>>() {});
                        if (order <= list.size()) attendance = list.get(order - 1);
                    } catch (Exception e) {
                        throw new AppException(ErrorCode.INTERNAL_ERROR);
                    }
                    return AttendanceItemDTO.builder()
                            .id(st.getId())
                            .code(st.getCode())
                            .firstname(u.getFirstName())
                            .lastname(u.getLastName())
                            .gender(u.getGender())
                            .dateofbirth(
                                    u.getDateOfBirth() != null
                                            ? u.getDateOfBirth().toString()
                                            : null)
                            .avatar(u.getAvatar())
                            .attendance(attendance)
                            .note(cs.getNote())
                            .build();
                })
                .toList();
    }

    @Override
    public AttendanceSummaryDTO getAttendanceSummary(Long courseId) {
        // Danh sách buổi học
        List<Session> sessions = sessionRepository.findByCourseIdOrderByOrderSessionAsc(courseId);
        if (sessions.isEmpty()) {
            throw new AppException(ErrorCode.SESSION_NOT_FOUND);
        }
        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);
        if (courseStudents.isEmpty()) {
            throw new AppException(ErrorCode.COURSE_NOT_FOUND);
        }
        // Map danh sách session
        List<SessionInfoDTO> sessionInfos = sessions.stream()
                .map(s -> SessionInfoDTO.builder()
                        .id(s.getId())
                        .order(s.getOrderSession())
                        .date(s.getDate() != null ? s.getDate().toString() : null)
                        .starttime(s.getStartTime() != null ? s.getStartTime().toString() : null)
                        .endtime(s.getEndTime() != null ? s.getEndTime().toString() : null)
                        .isabsent(s.isAbsent())
                        .build())
                .collect(Collectors.toList());

        // Map danh sách học viên + trạng thái điểm danh của từng buổi
        List<StudentInfoDTO> studentInfos = courseStudents.stream()
                .map(cs -> {
                    Student st = cs.getStudent();
                    User u = st.getUser();

                    List<Integer> attList = new ArrayList<>();
                    try {
                        attList = objectMapper.readValue(cs.getAttendanceList(), new TypeReference<List<Integer>>() {});
                    } catch (Exception ignored) {
                    }

                    return StudentInfoDTO.builder()
                            .id(st.getId())
                            .code(st.getCode())
                            .firstname(u.getFirstName())
                            .lastname(u.getLastName())
                            .avatar(u.getAvatar())
                            .attendancelist(attList)
                            .note(cs.getNote())
                            .build();
                })
                .collect(Collectors.toList());

        return AttendanceSummaryDTO.builder()
                .sessions(sessionInfos)
                .students(studentInfos)
                .build();
    }
}
