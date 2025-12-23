package com.lmsservice.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.response.*;
import com.lmsservice.entity.*;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.*;
import com.lmsservice.service.StaffStudentProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffStudentProfileServiceImpl implements StaffStudentProfileService {

    UserRepository userRepo;
    StudentRepository studentRepo;
    CourseStudentRepository courseStudentRepo;
    SessionRepository sessionRepo;

    ObjectMapper objectMapper;

    // ================= PROFILE =================
    @Override
    @Transactional(readOnly = true)
    public StaffUserProfileResponse getStudentProfile(Long userId) {
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // đảm bảo đây là student
        studentRepo.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));

        return StaffUserProfileResponse.builder()
                .id(u.getId())
                .userName(u.getUserName())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .roleName(u.getRole() != null ? u.getRole().getName() : null)
                .isActive(u.getIsActive())
                .build();
    }

    // ================= COURSES =================
    @Override
    @Transactional(readOnly = true)
    public List<StaffCourseBriefResponse> getStudentCourses(Long userId) {
        Student student = studentRepo.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));

        List<CourseStudent> links = courseStudentRepo.findByStudent_Id(student.getId());
        if (links == null || links.isEmpty()) return List.of();

        return links.stream()
                .map(CourseStudent::getCourse)
                .filter(Objects::nonNull)
                .distinct()
                .map(c -> StaffCourseBriefResponse.builder()
                        .courseId(c.getId())
                        .code(c.getCode())
                        .name(c.getTitle())
                        .status(String.valueOf(c.getStatus()))
                        .startDate(String.valueOf(c.getStartDate()))
                        .build()
                )
                .collect(Collectors.toList());
    }

    // ================= ATTENDANCE SUMMARY =================
    @Override
    @Transactional(readOnly = true)
    public StudentAttendanceOverviewResponse getAttendanceSummary(Long userId, Long courseId) {
        Student student = studentRepo.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));

        if (courseId == null) throw new AppException(ErrorCode.INVALID_REQUEST);

        CourseStudent cs = courseStudentRepo.findByCourseIdAndStudentId(courseId, student.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        List<Session> sessions = sessionRepo.findByCourseIdOrderByOrderSessionAsc(courseId);
        if (sessions == null) sessions = List.of();

        List<AttendanceRecordDTO> attList = readAttendanceRecordList(cs.getAttendanceList());

        int present = 0, late = 0, absent = 0, excused = 0;

        for (Session s : sessions) {
            int idx = (s.getOrderSession() == null ? -1 : s.getOrderSession() - 1);
            if (idx < 0 || idx >= attList.size()) continue;

            AttendanceRecordDTO rec = attList.get(idx);
            if (rec == null || rec.getStatus() == null) continue;

            switch (rec.getStatus()) {
                case 1 -> present++;
                case 2 -> late++;
                case 0 -> absent++;
                case 3 -> excused++;
                default -> {}
            }
        }

        int total = sessions.size();
        double rate = total == 0 ? 0.0 : ((present + late + excused) * 100.0 / total);

        return StudentAttendanceOverviewResponse.builder()
                .present(present)
                .late(late)
                .absent(absent)
                .excused(excused)
                .rate(rate)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAttendanceDetailDTO> getAttendanceDetails(Long userId, Long courseId) {
        Student student = studentRepo.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_FOUND));

        CourseStudent cs = courseStudentRepo.findByCourseIdAndStudentId(courseId, student.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ENROLLMENT_NOT_FOUND));

        List<Session> sessions = sessionRepo.findByCourseIdOrderByOrderSessionAsc(courseId);
        if (sessions == null || sessions.isEmpty()) return List.of();

        List<AttendanceRecordDTO> attList = readAttendanceRecordList(cs.getAttendanceList());

        Course course = cs.getCourse();
        String courseTitle = course != null ? course.getTitle() : null;

        List<StudentAttendanceDetailDTO> out = new ArrayList<>();
        for (Session s : sessions) {
            int idx = (s.getOrderSession() == null ? -1 : s.getOrderSession() - 1);

            Integer status = null;
            String note = null;

            if (idx >= 0 && idx < attList.size()) {
                AttendanceRecordDTO rec = attList.get(idx);
                if (rec != null) {
                    status = rec.getStatus();
                    note = rec.getNote();
                }
            }

            out.add(StudentAttendanceDetailDTO.builder()
                    .sessionId(s.getId())
                    .courseId(courseId)
                    .courseTitle(courseTitle)
                    .date(s.getDate())
                    .startTime(s.getStartTime())
                    .endTime(s.getEndTime())
                    .attendance(status)                 // numeric 0/1/2/3
                    .statusText(toStatusText(status))   // PRESENT/ABSENT/...
                    .note(note)                         // lấy đúng note
                    .build());
        }

        return out;
    }

    private List<AttendanceRecordDTO> readAttendanceRecordList(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            // attendanceList bạn đang lưu đúng là List<AttendanceRecordDTO>
            return objectMapper.readValue(json, new TypeReference<List<AttendanceRecordDTO>>() {});
        } catch (Exception e) {
            // data bẩn -> không crash staff view
            return new ArrayList<>();
        }
    }

    private String toStatusText(Integer att) {
        if (att == null) return "NOT_RECORDED";
        return switch (att) {
            case 1 -> "PRESENT";
            case 0 -> "ABSENT";
            case 2 -> "LATE";
            case 3 -> "EXCUSED";
            default -> "UNKNOWN";
        };
    }
}
