package com.lmsservice.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.*;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AvailableMakeUpSessionResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.entity.*;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.MakeUpRequestRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.MakeUpRequestService;
import com.lmsservice.util.MakeUpRequestStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
    StudentRepository studentRepository;

    private LocalDateTime sessionDateTime(Session s) {
        if (s == null || s.getDate() == null || s.getStartTime() == null) return null;
        return LocalDateTime.of(s.getDate(), s.getStartTime());
    }

    /**
     * Check student thực sự vắng buổi missedSession:
     * attendanceList[order-1].attendance phải = 0 hoặc null (NOT_SUBMITTED).
     * Nếu = 1 => đã có mặt => không được tạo request.
     */
    private void assertStudentWasAbsent(CourseStudent cs, int order) {
        List<AttendanceItemDTO> items;
        try {
            if (cs.getAttendanceList() == null || cs.getAttendanceList().isBlank()) {
                items = new ArrayList<>();
            } else {
                items = objectMapper.readValue(cs.getAttendanceList(), new TypeReference<List<AttendanceItemDTO>>() {});
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.ATTENDANCE_JSON_INVALID);
        }

        // Nếu list chưa đủ phần tử => coi như NOT_SUBMITTED (null) => cho phép coi là vắng
        if (items.size() < order) return;

        AttendanceItemDTO item = items.get(order - 1);
        if (item == null) return; // NOT_SUBMITTED

        Integer att = item.getAttendance();
        // Quy ước: 1 = có mặt, 0/null = vắng hoặc chưa submit
        if (att != null && att == 1) {
            throw new AppException(ErrorCode.INVALID_REQUEST);

        }
    }

    @PersistenceContext
    EntityManager em;
    private MakeUpRequestResponse toResponse(MakeUpRequest e) {
        User stu = e.getStudent();
        Course c = e.getCourse();
        Session missed = e.getSession();

        String fullName = ((stu.getFirstName() == null) ? "" : stu.getFirstName())
                + " " + ((stu.getLastName() == null) ? "" : stu.getLastName());

        LocalDateTime missedDT = null;
        if (missed != null && missed.getDate() != null && missed.getStartTime() != null) {
            missedDT = LocalDateTime.of(missed.getDate(), missed.getStartTime());
        }

        Session approvedSession = e.getApprovedSession();
        LocalDateTime approvedDT = null;
        if (approvedSession != null && approvedSession.getDate() != null && approvedSession.getStartTime() != null) {
            approvedDT = LocalDateTime.of(approvedSession.getDate(), approvedSession.getStartTime());
        }

        Course approvedCourse = e.getApprovedCourse();

        return MakeUpRequestResponse.builder()
                .id(e.getId())
                .studentId(stu.getId())
                .studentName(fullName.trim())
                .courseId(c.getId())
                .courseName(c.getTitle())
                .sessionId(missed.getId())
                .sessionTitle("Buổi " + missed.getOrderSession())
                .sessionDateTime(missedDT)
                .reason(e.getReason())
                .status(e.getStatus())
                .adminNote(e.getAdminNote())
                .createdAt(e.getCreatedAt())
                .processedAt(e.getProcessedAt())

                .preferredSessionId(e.getPreferredSession() != null ? e.getPreferredSession().getId() : null)
                .approvedSessionId(approvedSession != null ? approvedSession.getId() : null)
                .approvedCourseId(approvedCourse != null ? approvedCourse.getId() : null)
                .approvedCourseName(approvedCourse != null ? approvedCourse.getTitle() : null)
                .approvedSessionDateTime(approvedDT)
                .scheduledAt(e.getScheduledAt())
                .attendedAt(e.getAttendedAt())
                .build();
    }

    @Override
    @Transactional
    public MakeUpRequestResponse selectPreferredSession(Long requestId, Long preferredSessionId) {
        Long studentId = currentUserService.requireStudentId();

        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        // chỉ chủ request mới chọn
        if (!entity.getStudent().getId().equals(studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE))
                .getUser().getId())) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHORIZED);
        }

        if (entity.getStatus() != MakeUpRequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Session preferred = sessionRepository.findById(preferredSessionId)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        // Validate tương đương: cùng subject + cùng orderSession
        Session missed = entity.getSession();
        Long subjectMissed = missed.getCourse().getSubject().getId();
        Long subjectPreferred = preferred.getCourse().getSubject().getId();

        if (!subjectMissed.equals(subjectPreferred) || !missed.getOrderSession().equals(preferred.getOrderSession())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Không được chọn buổi thuộc chính course gốc (tuỳ bạn, nhưng demo thường nên chặn)
        if (preferred.getCourse().getId().equals(entity.getCourse().getId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        // Không cho chọn buổi đã qua
        if (preferred.getDate() != null && preferred.getStartTime() != null) {
            LocalDateTime dt = LocalDateTime.of(preferred.getDate(), preferred.getStartTime());
            if (dt.isBefore(LocalDateTime.now())) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
        }

        entity.setPreferredSession(preferred);
        entity = makeUpRequestRepository.save(entity);
        return toResponse(entity);
    }

    @Override
    @Transactional
    public MakeUpRequestResponse createForCurrentStudent(CreateMakeUpRequestRequest request) {
        Long studentId = currentUserService.requireStudentId();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));
        User user = student.getUser();

        Session missedSession = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        // 0) Không cho xin học bù nếu buổi vắng ở tương lai (chưa diễn ra)
        LocalDateTime missedDT = sessionDateTime(missedSession);
        if (missedDT != null && missedDT.isAfter(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
            // Khuyến nghị ErrorCode: MAKEUP_REQUEST_MISSED_SESSION_IN_FUTURE
        }

        // 1) Check student thuộc course của buổi vắng + lấy CourseStudent để check attendance
        CourseStudent cs = courseStudentRepository
                .findByCourseIdAndStudentId(missedSession.getCourse().getId(), studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        // 2) Check student thực sự vắng buổi đó
        int order = missedSession.getOrderSession();
        assertStudentWasAbsent(cs, order);

        // 3) Không tạo trùng cho cùng (student_id, session_id)
        if (makeUpRequestRepository.existsByStudent_IdAndSession_Id(user.getId(), missedSession.getId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
            // Khuyến nghị ErrorCode: MAKEUP_REQUEST_DUPLICATE
        }

        MakeUpRequest entity = MakeUpRequest.builder()
                .student(user)
                .session(missedSession)
                .course(missedSession.getCourse())
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
    public List<AvailableMakeUpSessionResponse> getAvailableMakeupSessionsForStudent(Long missedSessionId) {
        Long studentId = currentUserService.requireStudentId();

        Session missed = sessionRepository.findById(missedSessionId)
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

        // student thuộc course gốc
        courseStudentRepository
                .findByCourseIdAndStudentId(missed.getCourse().getId(), studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        // Tiêu chí dễ demo và đúng:
        // - Cùng subject
        // - Cùng orderSession (buổi tương đương)
        // - Ngày học >= hiện tại
        // - Khác course (tránh chọn lại chính lớp đó)
        // Bạn có thể thêm điều kiện status course/session nếu có.
        Long subjectId = missed.getCourse().getSubject().getId();
        Integer orderSession = Integer.valueOf(missed.getOrderSession());
        Long originalCourseId = missed.getCourse().getId();

        String jpql = """
            select s
            from Session s
            join fetch s.course c
            left join fetch c.teacher t
            left join fetch s.room r
            where c.subject.id = :subjectId
              and s.orderSession = :orderSession
              and c.id <> :originalCourseId
              and (s.date is not null)
            order by s.date asc, s.startTime asc
        """;

        List<Session> sessions = em.createQuery(jpql, Session.class)
                .setParameter("subjectId", subjectId)
                .setParameter("orderSession", orderSession)
                .setParameter("originalCourseId", originalCourseId)
                .getResultList();

        LocalDateTime now = LocalDateTime.now();

        List<AvailableMakeUpSessionResponse> result = new ArrayList<>();
        for (Session s : sessions) {
            if (s.getDate() == null || s.getStartTime() == null) continue;
            LocalDateTime dt = LocalDateTime.of(s.getDate(), s.getStartTime());
            if (dt.isBefore(now)) continue;

            String teacherName = null;
            if (s.getCourse() != null && s.getCourse().getTeacher() != null) {
                Teacher teacher = s.getCourse().getTeacher();
                teacherName = teacher.getUser() != null
                        ? (teacher.getUser().getFirstName() + " " + teacher.getUser().getLastName())
                        : null;
            }

            String roomName = s.getRoom() != null ? s.getRoom().getLocation() : null;

            result.add(AvailableMakeUpSessionResponse.builder()
                    .sessionId(s.getId())
                    .courseId(s.getCourse().getId())
                    .courseName(s.getCourse().getTitle())
                    .orderSession(Integer.valueOf(s.getOrderSession()))
                    .sessionDateTime(dt)
                    .roomName(roomName)
                    .teacherName(teacherName)
                    .build());
        }

        return result;
    }

    @Override
    @Transactional
    public MakeUpRequestResponse approve(Long requestId, ApproveMakeUpRequestRequest request) {

        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        if (entity.getStatus() != MakeUpRequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Session approved = sessionRepository.findById(request.getMakeupSessionId())
                .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));
        // Không cho approve buổi bù đã qua
        LocalDateTime approvedDT = sessionDateTime(approved);
        if (approvedDT != null && approvedDT.isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Session missed = entity.getSession();

        Long subjectMissed = missed.getCourse().getSubject().getId();
        Long subjectApproved = approved.getCourse().getSubject().getId();

        if (!subjectMissed.equals(subjectApproved) || !missed.getOrderSession().equals(approved.getOrderSession())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        if (approved.getCourse().getId().equals(entity.getCourse().getId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        entity.setApprovedSession(approved);
        entity.setApprovedCourse(approved.getCourse());
        entity.setScheduledAt(LocalDateTime.now());

        entity.setStatus(MakeUpRequestStatus.APPROVED);
        entity.setProcessedAt(LocalDateTime.now());
        entity.setAdminNote(request.getAdminNote());

        try {
            entity.setProcessedBy(currentUserService.getCurrentUser());
        } catch (UnAuthorizeException ignored) {}

        entity = makeUpRequestRepository.save(entity);
        return toResponse(entity);
    }


    @Override
    @Transactional
    public MakeUpRequestResponse reject(Long requestId, RejectMakeUpRequestRequest request) {
        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        if (entity.getStatus() != MakeUpRequestStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        entity.setStatus(MakeUpRequestStatus.REJECTED);
        entity.setProcessedAt(LocalDateTime.now());
        entity.setAdminNote(request.getAdminNote());

        try {
            User handler = currentUserService.getCurrentUser();
            entity.setProcessedBy(handler);
        } catch (UnAuthorizeException ignored) {}

        entity = makeUpRequestRepository.save(entity);
        return toResponse(entity);
    }

    @Override
    @Transactional
    public MakeUpRequestResponse markAttended(Long requestId, MarkMakeUpAttendedRequest request) {
        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        if (entity.getStatus() == MakeUpRequestStatus.DONE) {
            throw new AppException(ErrorCode.MAKEUP_REQUEST_ALREADY_DONE);
        }
        if (entity.getStatus() != MakeUpRequestStatus.APPROVED) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        if (entity.getApprovedSession() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Session missedSession = entity.getSession();
        Course course = entity.getCourse();

        User studentUser = entity.getStudent();
        Student student = studentRepository.findByUserId(studentUser.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        CourseStudent cs = courseStudentRepository
                .findByCourseIdAndStudentId(course.getId(), student.getId())
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        int order = missedSession.getOrderSession();

        List<AttendanceItemDTO> attendanceItems;
        try {
            if (cs.getAttendanceList() == null || cs.getAttendanceList().isBlank()) {
                attendanceItems = new ArrayList<>();
            } else {
                attendanceItems = objectMapper.readValue(
                        cs.getAttendanceList(),
                        new TypeReference<List<AttendanceItemDTO>>() {}
                );
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.ATTENDANCE_JSON_INVALID);
        }

        while (attendanceItems.size() < order) {
            attendanceItems.add(new AttendanceItemDTO());
        }

        AttendanceItemDTO item = attendanceItems.get(order - 1);
        if (item == null) item = new AttendanceItemDTO();

        item.setAttendance(1);
        String note = request.getNote();
        if (note == null || note.isBlank()) {
            Session approved = entity.getApprovedSession();
            Course approvedCourse = entity.getApprovedCourse();
            String courseName = approvedCourse != null ? approvedCourse.getTitle() : "N/A";
            String sessName = approved != null ? ("Buổi " + approved.getOrderSession()) : "N/A";
            note = "Đã học bù (" + courseName + " - " + sessName + ")";
        }
        item.setNote(note);


        attendanceItems.set(order - 1, item);

        try {
            cs.setAttendanceList(objectMapper.writeValueAsString(attendanceItems));
        } catch (Exception e) {
            throw new AppException(ErrorCode.ATTENDANCE_JSON_INVALID);
        }
        courseStudentRepository.save(cs);

        User handler = null;
        try {
            handler = currentUserService.getCurrentUser();
        } catch (UnAuthorizeException ignored) {}

        entity.setStatus(MakeUpRequestStatus.DONE);
        entity.setProcessedBy(handler);
        entity.setProcessedAt(LocalDateTime.now());
        entity.setAdminNote(note);
        entity.setAttendedAt(LocalDateTime.now());

        entity = makeUpRequestRepository.save(entity);
        return toResponse(entity);
    }
    @Override
    public Page<MakeUpRequestResponse> getForStudent(String status, Long courseId, Pageable pageable) {
        Long studentId = currentUserService.requireStudentId();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));
        Long userId = student.getUser().getId();

        MakeUpRequestStatus st = null;
        if (status != null && !status.isBlank()) {
            st = MakeUpRequestStatus.valueOf(status);
        }

        Page<MakeUpRequest> page;
        if (st != null && courseId != null) {
            page = makeUpRequestRepository.findByStudent_IdAndStatusAndCourse_Id(userId, st, courseId, pageable);
        } else if (st != null) {
            page = makeUpRequestRepository.findByStudent_IdAndStatus(userId, st, pageable);
        } else if (courseId != null) {
            page = makeUpRequestRepository.findByStudent_IdAndCourse_Id(userId, courseId, pageable);
        } else {
            page = makeUpRequestRepository.findByStudent_Id(userId, pageable);
        }

        return page.map(this::toResponse);
    }
    @Override
    public MakeUpRequestResponse getDetailForStudent(Long requestId) {
        Long studentId = currentUserService.requireStudentId();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));
        Long userId = student.getUser().getId();

        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        if (!entity.getStudent().getId().equals(userId)) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHORIZED);
        }

        return toResponse(entity);
    }
    @Override
    public MakeUpRequestResponse getDetailForAdmin(Long requestId) {
        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));
        return toResponse(entity);
    }
    @Override
    public List<AvailableMakeUpSessionResponse> getAvailableMakeupSessionsForAdmin(Long requestId) {
        MakeUpRequest entity = makeUpRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.MAKEUP_REQUEST_NOT_FOUND));

        Session missed = entity.getSession();
        if (missed == null || missed.getCourse() == null || missed.getCourse().getSubject() == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }

        Long subjectId = missed.getCourse().getSubject().getId();
        Integer orderSession = Integer.valueOf(missed.getOrderSession());
        Long originalCourseId = missed.getCourse().getId();

        String jpql = """
        select s
        from Session s
        join fetch s.course c
        left join fetch c.teacher t
        left join fetch s.room r
        where c.subject.id = :subjectId
          and s.orderSession = :orderSession
          and c.id <> :originalCourseId
          and (s.date is not null)
        order by s.date asc, s.startTime asc
    """;

        List<Session> sessions = em.createQuery(jpql, Session.class)
                .setParameter("subjectId", subjectId)
                .setParameter("orderSession", orderSession)
                .setParameter("originalCourseId", originalCourseId)
                .getResultList();

        LocalDateTime now = LocalDateTime.now();

        List<AvailableMakeUpSessionResponse> result = new ArrayList<>();
        for (Session s : sessions) {
            if (s.getDate() == null || s.getStartTime() == null) continue;
            LocalDateTime dt = LocalDateTime.of(s.getDate(), s.getStartTime());
            if (dt.isBefore(now)) continue;

            String teacherName = null;
            if (s.getCourse() != null && s.getCourse().getTeacher() != null) {
                Teacher teacher = s.getCourse().getTeacher();
                teacherName = teacher.getUser() != null
                        ? (teacher.getUser().getFirstName() + " " + teacher.getUser().getLastName())
                        : null;
            }

            String roomName = s.getRoom() != null ? s.getRoom().getLocation() : null;

            result.add(AvailableMakeUpSessionResponse.builder()
                    .sessionId(s.getId())
                    .courseId(s.getCourse().getId())
                    .courseName(s.getCourse().getTitle())
                    .orderSession(Integer.valueOf(s.getOrderSession()))
                    .sessionDateTime(dt)
                    .roomName(roomName)
                    .teacherName(teacherName)
                    .build());
        }

        return result;
    }

}
