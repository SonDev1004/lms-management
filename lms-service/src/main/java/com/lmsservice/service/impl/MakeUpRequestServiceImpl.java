package com.lmsservice.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.CreateMakeUpRequestRequest;
import com.lmsservice.dto.request.MakeUpRequestStatus;
import com.lmsservice.dto.request.MarkMakeUpAttendedRequest;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.entity.*;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.MakeUpRequestRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.MakeUpRequestService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MakeUpRequestServiceImpl implements MakeUpRequestService {

    MakeUpRequestRepository makeUpRequestRepository;
    SessionRepository sessionRepository;
    CourseStudentRepository courseStudentRepository;
    CurrentUserService currentUserService;
    ObjectMapper objectMapper;
    UserRepository userRepository;

    private MakeUpRequestResponse toResponse(MakeUpRequest entity) {
        User stu = entity.getStudent();
        Course c = entity.getCourse();
        Session s = entity.getSession();
        String fullName = stu.getFirstName() + " " + stu.getLastName();

        return MakeUpRequestResponse.builder()
                .id(entity.getId())
                .studentId(stu.getId())
                .studentName(fullName)
                .courseId(c.getId())
                .courseName(c.getTitle())
                .sessionId(s.getId())
                .sessionTitle(s.getClass().getName())
                .sessionDateTime(LocalDateTime.from(s.getStartTime()))
                .reason(entity.getReason())
                .status(entity.getStatus())
                .adminNote(entity.getAdminNote())
                .createdAt(entity.getCreatedAt())
                .processedAt(entity.getProcessedAt())
                .build();
    }

    @Override
    @Transactional
    public MakeUpRequestResponse createForCurrentStudent(CreateMakeUpRequestRequest request) {
        User student = currentUserService.getCurrentUser();

        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        CourseStudent cs = courseStudentRepository
                .findByCourseIdAndStudentId(session.getCourse().getId(), student.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        MakeUpRequest entity = MakeUpRequest.builder()
                .student(student)
                .session(session)
                .course(session.getCourse())
                .reason(request.getReason())
                .status(MakeUpRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        entity = makeUpRequestRepository.save(entity);
        return toResponse(entity);
    }

    @Override
    public Page<MakeUpRequestResponse> getForAdmin(String status, Long courseId, Pageable pageable) {
        MakeUpRequestStatus st = null;
        if (status != null && !status.isBlank()) {
            st = MakeUpRequestStatus.valueOf(status);
        }

        Page<MakeUpRequest> page;
        if (st != null && courseId != null) {
            page = makeUpRequestRepository.findByStatusAndCourse_Id(st, courseId, pageable);
        } else if (st != null) {
            page = makeUpRequestRepository.findByStatus(st, pageable);
        } else {
            page = makeUpRequestRepository.findAll(pageable);
        }

        return page.map(this::toResponse);
    }

    @Override
    @Transactional
    public MakeUpRequestResponse markAttended(Long requestId, MarkMakeUpAttendedRequest request) {
        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        if (entity.getStatus() == MakeUpRequestStatus.DONE) {
            throw new AppException(ErrorCode.MAKEUP_REQUEST_ALREADY_DONE);
        }

        Session session = entity.getSession();
        Course course = entity.getCourse();
        User student = entity.getStudent();

        CourseStudent cs = courseStudentRepository
                .findByCourseIdAndStudentId(course.getId(), student.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        int order = session.getOrderSession();

        List<AttendanceItemDTO> attendanceItems;
        try {
            if (cs.getAttendanceList() == null || cs.getAttendanceList().isBlank()) {
                attendanceItems = new ArrayList<>();
            } else {
                attendanceItems = objectMapper.readValue(
                        cs.getAttendanceList(),
                        new TypeReference<List<AttendanceItemDTO>>() {});
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.ATTENDANCE_JSON_INVALID);
        }

        while (attendanceItems.size() < order) {
            attendanceItems.add(new AttendanceItemDTO());
        }

        AttendanceItemDTO item = attendanceItems.get(order - 1);
        if (item == null) item = new AttendanceItemDTO();
        item.setAttendance(0);
        String note = request.getNote();
        if (note == null || note.isBlank()) note = "Đã học bù";
        item.setNote(note);

        attendanceItems.set(order - 1, item);

        try {
            cs.setAttendanceList(objectMapper.writeValueAsString(attendanceItems));
        } catch (Exception e) {
            throw new AppException(ErrorCode.ATTENDANCE_JSON_INVALID);
        }

        courseStudentRepository.save(cs);

        User admin = currentUserService.getCurrentUser();
        entity.setStatus(MakeUpRequestStatus.DONE);
        entity.setProcessedBy(admin);
        entity.setProcessedAt(LocalDateTime.now());
        entity.setAdminNote(note);

        entity = makeUpRequestRepository.save(entity);
        return toResponse(entity);
    }
}
