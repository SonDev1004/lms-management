// com.lmsservice.service.impl.AssignmentServiceImpl.java
package com.lmsservice.service.impl;

import com.lmsservice.controller.NotificationSocketController;
import com.lmsservice.dto.request.AssignmentRequest;
import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.dto.response.AssignmentStudentStatusDto;
import com.lmsservice.dto.response.NotificationResponse;
import com.lmsservice.dto.response.StudentAssignmentItemResponse;
import com.lmsservice.entity.*;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.mapper.AssignmentMapper;
import com.lmsservice.repository.*;
import com.lmsservice.service.AssignmentService;
import com.lmsservice.service.NotificationService;
import com.lmsservice.util.AssignmentRetakeStatus;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    NotificationService notificationService;
    NotificationSocketController notificationSocketController;
    AssignmentRepository assignmentRepository;
    AssignmentMapper assignmentMapper;
    UserRepository userRepository;
    CourseStudentRepository courseStudentRepository;
    CourseRepository courseRepository;
    SubmissionRepository submissionRepository;
    AssignmentRetakeRequestRepository assignmentRetakeRequestRepository;
    /* ======================== HELPER ======================== */
    private static final Logger log = LoggerFactory.getLogger(AssignmentServiceImpl.class);

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Chỉ cho phép giáo viên DẠY course này thao tác (list/create/update/delete).
     * Course đã có teacherId / teacher nên check tại đây.
     */
    private void ensureTeacherOfCourse(Long courseId) {
        User currentUser = getCurrentUser();

        // check role
        if (!"TEACHER".equalsIgnoreCase(currentUser.getRole().getName())) {
            throw new UnAuthorizeException(ErrorCode.UNAUTHORIZED);
        }

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        // Nếu Course có quan hệ tới User teacher:
//        if (!course.getTeacher().getId().equals(currentUser.getId())) {
//            throw new UnAuthorizeException(ErrorCode.UNAUTHORIZED);
//        }

        // Nếu Course của bạn dùng field Long teacherId thay vì teacher:
        // if (!course.getTeacherId().equals(currentUser.getId())) {
        //     throw new UnAuthorizeException(ErrorCode.UNAUTHORIZED);
        // }
    }

    /* ==========================================================
     *    DÙNG CHUNG – Student (và Teacher nếu cần)
     * ========================================================== */
    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByCourseId(Long courseId) {
        User currentUser = getCurrentUser();

        boolean isTeacher = "TEACHER".equalsIgnoreCase(currentUser.getRole().getName());
        List<Assignment> assignments;

        if (isTeacher) {
            // chỉ teacher dạy course này mới xem được
            ensureTeacherOfCourse(courseId);
            assignments = assignmentRepository.findByCourseId(courseId);
        } else {
            // Học viên phải enrol mới xem được
            boolean enrolled = courseStudentRepository.existsByCourseIdAndStudentId(courseId, currentUser.getId());
            if (!enrolled) {
                throw new UnAuthorizeException(ErrorCode.STUDENT_IS_NOT_ENROLLED);
            }
            assignments = assignmentRepository.findByCourseIdAndIsActiveTrue(courseId);
        }

        return assignments.stream().map(assignmentMapper::toResponse).toList();
    }

    /* ==========================================================
     *                 TEACHER SIDE – LIST
     *  (dùng cho TeacherAssignmentPage.jsx)
     * ========================================================== */

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByCourseForTeacher(Long courseId) {
        ensureTeacherOfCourse(courseId);
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        return assignments.stream().map(assignmentMapper::toResponse).toList();
    }

    /* ==========================================================
     *                 TEACHER SIDE – CREATE
     * ========================================================== */

    @Override
    @Transactional
    public AssignmentResponse createAssignmentForTeacher(Long courseId, AssignmentRequest req) {
        ensureTeacherOfCourse(courseId);

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        Assignment entity = new Assignment();
        entity.setCourse(course);
        entity.setTitle(req.getTitle());

        if (req.getMaxScore() != null) {
            entity.setMaxScore(req.getMaxScore().toString());
        }

        entity.setFileName(req.getFileName());

        if (req.getFactor() != null) {
            entity.setFactor(req.getFactor().intValue());
        }
        entity.setDueDate(req.getDueDate());
        entity.setActive(req.getIsActive() != null ? req.getIsActive() : Boolean.TRUE);

        if (req.getAssignmentType() != null && !req.getAssignmentType().isEmpty()) {
            String typeStr = req.getAssignmentType().getFirst();
            entity.setAssignmentType(Assignment.AssignmentType.valueOf(typeStr.toUpperCase()));
        }

        Assignment saved = assignmentRepository.save(entity);

        return assignmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssignmentResponse publishAssignment(Long assignmentId) {
        Assignment entity = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        Long courseId = entity.getCourse().getId();
        ensureTeacherOfCourse(courseId);

        if (Boolean.TRUE.equals(entity.isActive())) {
            return assignmentMapper.toResponse(entity);
        }

        entity.setActive(true);
        Assignment saved = assignmentRepository.save(entity);

        try {
            notifyNewAssignmentToCourseStudents(saved);
        } catch (Exception ex) {
            log.error("Failed to send notifications for assignment " + saved.getId(), ex);
        }

        return assignmentMapper.toResponse(saved);
    }

    private void notifyNewAssignmentToCourseStudents(Assignment assignment) {
        Long courseId = assignment.getCourse().getId();
        String courseTitle = assignment.getCourse().getTitle();
        String assignmentTitle = assignment.getTitle();

        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);

        for (CourseStudent cs : courseStudents) {
            try {
                Long studentUserId = cs.getStudent().getUser().getId();

                String title = "Bài tập mới: " + assignmentTitle;
                String content = "<b>Bài tập mới: " + assignmentTitle + "</b><br/>Khoá: " + courseTitle;
                // URL để FE bấm vào sẽ mở màn Assignment list / Quiz list của học sinh
                String url = "/student/courses/" + courseId + "/assignments";

                NotificationResponse noti =
                        notificationService.createForUser(studentUserId, title, content, url);

                if (noti != null) {
                    notificationSocketController.sendToUserId(studentUserId, noti);
                }
            } catch (Exception e) {
                log.error(
                        "Failed to send notification for assignment {} to student {}",
                        assignment.getId(),
                        cs.getStudent().getId(),
                        e
                );
            }
        }
    }



    /* ==========================================================
     *                 TEACHER SIDE – UPDATE
     * ========================================================== */

    @Override
    @Transactional
    public AssignmentResponse updateAssignmentForTeacher(Long assignmentId, AssignmentRequest req) {
        Assignment entity = assignmentRepository.findById(assignmentId).orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        Long courseId = entity.getCourse().getId();
        ensureTeacherOfCourse(courseId);

        if (req.getTitle() != null) {
            entity.setTitle(req.getTitle());
        }
        if (req.getMaxScore() != null) {
            entity.setMaxScore(req.getMaxScore().toString());
        }
        if (req.getFileName() != null) {
            entity.setFileName(req.getFileName());
        }
        if (req.getFactor() != null) {
            entity.setFactor(req.getFactor().intValue());
        }
        if (req.getDueDate() != null) {
            entity.setDueDate(req.getDueDate());
        }
        if (req.getIsActive() != null) {
            entity.setActive(req.getIsActive());
        }

        if (req.getCourseId() != null && !req.getCourseId().equals(courseId)) {
            ensureTeacherOfCourse(req.getCourseId());
            Course newCourse = courseRepository.findById(req.getCourseId()).orElseThrow(() -> new IllegalArgumentException("Course not found: " + req.getCourseId()));
            entity.setCourse(newCourse);
        }

        Assignment saved = assignmentRepository.save(entity);
        return assignmentMapper.toResponse(saved);
    }

    /* ==========================================================
     *                 TEACHER SIDE – DELETE
     * ========================================================== */

    @Override
    @Transactional
    public void deleteAssignmentForTeacher(Long assignmentId) {
        Assignment entity = assignmentRepository.findById(assignmentId).orElse(null);

        if (entity == null) {
            return;
        }

        Long courseId = entity.getCourse().getId();
        ensureTeacherOfCourse(courseId);

        entity.setActive(false);
        assignmentRepository.save(entity);

    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAssignmentItemResponse> getAssignmentsForStudent(Long courseId, Long studentId) {
        List<Assignment> assignments =
                assignmentRepository.findByCourseIdAndIsActiveTrue(courseId);

        List<StudentAssignmentItemResponse> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Assignment a : assignments) {
            StudentAssignmentItemResponse dto = new StudentAssignmentItemResponse();
            dto.setId(a.getId());
            dto.setTitle(a.getTitle());
            dto.setDueDate(a.getDueDate());
            dto.setAssignmentType(
                    a.getAssignmentType() != null ? a.getAssignmentType().name() : null
            );
            dto.setMaxScore(a.getMaxScore());

            Optional<Submission> optSub =
                    submissionRepository.findTopByAssignment_IdAndStudent_IdOrderByStartedAtDesc(
                            a.getId(), studentId
                    );

            String status;
            BigDecimal studentScore = null;

            if (optSub.isPresent()) {
                Submission s = optSub.get();
                Integer gs = s.getGradedStatus();

                if (Objects.equals(gs, 1)) {
                    status = "GRADED";
                    studentScore = s.getScore();
                } else {
                    status = "SUBMITTED";
                }
            } else {
            LocalDateTime due = a.getDueDate();
            if (due != null && due.isBefore(now)) {
                // Quá hạn + chưa nộp → kiểm tra retake
                Optional<AssignmentRetakeRequest> retakeOpt =
                        assignmentRetakeRequestRepository
                                .findFirstByStudent_IdAndAssignment_IdAndStatusIn(
                                        studentId,
                                        a.getId(),
                                        java.util.List.of(
                                                AssignmentRetakeStatus.PENDING,
                                                AssignmentRetakeStatus.APPROVED
                                        )
                                );

                if (retakeOpt.isPresent()) {
                    AssignmentRetakeRequest r = retakeOpt.get();

                    if (r.getStatus() == AssignmentRetakeStatus.PENDING) {
                        status = "RETAKE_PENDING";
                    } else if (r.getStatus() == AssignmentRetakeStatus.APPROVED) {
                        LocalDateTime dl = r.getRetakeDeadline();
                        if (dl == null || dl.isAfter(now)) {
                            status = "RETAKE_APPROVED";
                        } else {
                            // hết hạn thi lại
                            status = "MISSING";
                        }
                    } else {
                        status = "MISSING";
                    }
                } else {
                    status = "MISSING";
                }
            } else {
                status = "NOT_SUBMITTED";
            }
        }

        dto.setStudentStatus(status);
            dto.setStudentScore(studentScore);

            result.add(dto);
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<AssignmentStudentStatusDto> getAssignmentStudentsForTeacher(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        Long courseId = assignment.getCourse().getId();
        ensureTeacherOfCourse(courseId);

        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);
        List<AssignmentStudentStatusDto> result = new ArrayList<>();

        for (CourseStudent cs : courseStudents) {
            Student s = cs.getStudent();
            Course c = cs.getCourse();   // 👈 lấy course (class)

            AssignmentStudentStatusDto dto = new AssignmentStudentStatusDto();
            dto.setStudentId(s.getId());
            dto.setStudentCode(s.getCode());
            dto.setFullName(s.getUser().getFirstName() + " " + s.getUser().getLastName());

            // "className" = tên course
            dto.setClassName(c != null ? c.getTitle() : null);

            Optional<Submission> latestOpt =
                    submissionRepository.findTopByAssignment_IdAndStudent_IdOrderByStartedAtDesc(
                            assignmentId, s.getId()
                    );

            if (latestOpt.isPresent()) {
                Submission sub = latestOpt.get();
                dto.setSubmittedAt(sub.getSubmittedDate());
                if (Objects.equals(sub.getGradedStatus(), 1)) {
                    dto.setStatus("GRADED");
                } else {
                    dto.setStatus("SUBMITTED");
                }
                dto.setScore(sub.getScore());
            } else {
                dto.setStatus("NOT_SUBMITTED");
            }

            result.add(dto);
        }
        return result;
    }

    @Override
    @Transactional
    public void remindNotSubmittedStudents(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        Long courseId = assignment.getCourse().getId();
        ensureTeacherOfCourse(courseId);

        List<CourseStudent> courseStudents = courseStudentRepository.findByCourseId(courseId);

        for (CourseStudent cs : courseStudents) {
            Long studentId = cs.getStudent().getId();
            Optional<Submission> latestOpt =
                    submissionRepository.findTopByAssignment_IdAndStudent_IdOrderByStartedAtDesc(
                            assignmentId, studentId);

            if (latestOpt.isPresent()) {

                continue;
            }

            Long studentUserId = cs.getStudent().getUser().getId();

            String title = "Nhắc nộp bài: " + assignment.getTitle();
            String content = "<b>Nhắc nộp bài: " + assignment.getTitle() + "</b><br/>Khoá: "
                    + assignment.getCourse().getTitle();
            String url = "/student/courses/" + courseId + "/assignments";

            NotificationResponse noti =
                    notificationService.createForUser(studentUserId, title, content, url);

            notificationSocketController.sendToUserId(studentUserId, noti);
        }
    }
}
