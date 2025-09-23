package com.lmsservice.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.MarkAttendanceRequest;
import com.lmsservice.dto.response.*;
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
    public List<AttendanceItemDTO> getAttendanceByDate(Long courseId, String dateStr) {
        LocalDate date;
        if (dateStr == null || dateStr.trim().isEmpty() || dateStr.equals("{}")) {
            // Nếu rỗng => mặc định hôm nay
            date = LocalDate.now();
        } else {
            try {
                date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
            } catch (DateTimeParseException e) {
                throw new AppException(ErrorCode.INVALID_DATE);
            }
        }
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
                    String note = null;
                    try {
                        List<AttendanceRecordDTO> list = objectMapper.readValue(
                                cs.getAttendanceList(), new TypeReference<List<AttendanceRecordDTO>>() {});
                        if (order <= list.size() && list.get(order - 1) != null) {
                            attendance = list.get(order - 1).getStatus();
                            note = list.get(order - 1).getNote();
                        }
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
                            .note(note)
                            .build();
                })
                .toList();
    }

    @Override
    public AttendanceSummaryDTO getAttendanceSummary(Long courseId) {
        List<Session> sessions = sessionRepository.findByCourseIdOrderByOrderSessionAsc(courseId);
        if (sessions.isEmpty()) throw new AppException(ErrorCode.SESSION_NOT_FOUND);

        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);
        if (courseStudents.isEmpty()) throw new AppException(ErrorCode.COURSE_NOT_FOUND);

        // map sessions
        List<SessionInfoDTO> sessionInfos = sessions.stream()
                .map(s -> SessionInfoDTO.builder()
                        .id(s.getId())
                        .order(s.getOrderSession())
                        .date(s.getDate() != null ? s.getDate().toString() : null)
                        .starttime(s.getStartTime() != null ? s.getStartTime().toString() : null)
                        .endtime(s.getEndTime() != null ? s.getEndTime().toString() : null)
                        .isabsent(s.isAbsent())
                        .build())
                .toList();

        // map students
        List<StudentInfoDTO> studentInfos = courseStudents.stream()
                .map(cs -> {
                    Student st = cs.getStudent();
                    User u = st.getUser();
                    List<AttendanceRecordDTO> attList = new ArrayList<>();
                    try {
                        attList = objectMapper.readValue(
                                cs.getAttendanceList(), new TypeReference<List<AttendanceRecordDTO>>() {});
                    } catch (Exception e) {
                        throw new AppException(ErrorCode.INTERNAL_ERROR);
                    }

                    return StudentInfoDTO.builder()
                            .id(st.getId())
                            .code(st.getCode())
                            .firstname(u.getFirstName())
                            .lastname(u.getLastName())
                            .avatar(u.getAvatar())
                            .attendancelist(attList)
                            .build();
                })
                .toList();

        return AttendanceSummaryDTO.builder()
                .sessions(sessionInfos)
                .students(studentInfos)
                .build();
    }

    @Override
    @Transactional
    public void markAttendance(MarkAttendanceRequest request) {
        LocalDate sessionDate;
        if (request.getDate() == null
                || request.getDate().trim().isEmpty()
                || request.getDate().equals("{}")) {
            // FE gửi trống hoặc {}
            sessionDate = LocalDate.now();
        } else {
            try {
                sessionDate = LocalDate.parse(request.getDate(), DateTimeFormatter.ISO_DATE);
            } catch (DateTimeParseException e) {
                throw new AppException(ErrorCode.INVALID_DATE);
            }
        }
        // 1️⃣ Tìm buổi học theo courseId + date
        Session session = sessionRepository
                .findByCourseIdAndDate(request.getCourseId(), sessionDate)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        int order = session.getOrderSession(); // Buổi thứ mấy

        // 2️⃣ Cập nhật trạng thái điểm danh cho từng học viên
        for (AttendanceItemDTO dto : request.getStudents()) {
            CourseStudent cs = courseStudentRepository
                    .findByCourseIdAndStudentId(request.getCourseId(), dto.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

            List<AttendanceRecordDTO> attList = new ArrayList<>();
            try {
                if (cs.getAttendanceList() != null) {
                    attList = objectMapper.readValue(
                            cs.getAttendanceList(), new TypeReference<List<AttendanceRecordDTO>>() {});
                }
            } catch (Exception ignored) {
            }

            // Bổ sung độ dài nếu cần
            while (attList.size() < order) attList.add(null);

            // Ghi trạng thái + note của buổi hiện tại
            attList.set(
                    order - 1,
                    AttendanceRecordDTO.builder()
                            .status(dto.getAttendance())
                            .note(dto.getNote())
                            .build());

            try {
                cs.setAttendanceList(objectMapper.writeValueAsString(attList));
            } catch (JsonProcessingException e) {
                throw new AppException(ErrorCode.INTERNAL_ERROR);
            }

            courseStudentRepository.save(cs);
        }
    }
}
