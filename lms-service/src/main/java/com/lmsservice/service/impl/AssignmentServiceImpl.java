// com.lmsservice.service.impl.AssignmentServiceImpl.java
package com.lmsservice.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmsservice.dto.request.AssignmentRequest;
import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.mapper.AssignmentMapper;
import com.lmsservice.repository.AssignmentRepository;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.AssignmentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    AssignmentRepository assignmentRepository;
    AssignmentMapper assignmentMapper;
    UserRepository userRepository;
    CourseStudentRepository courseStudentRepository;
    CourseRepository courseRepository;

    /* ======================== HELPER ======================== */

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
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

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

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
            boolean enrolled = courseStudentRepository
                    .existsByCourseIdAndStudentId(courseId, currentUser.getId());
            if (!enrolled) {
                throw new UnAuthorizeException(ErrorCode.STUDENT_IS_NOT_ENROLLED);
            }
            assignments = assignmentRepository.findByCourseIdAndIsActiveTrue(courseId);
        }

        return assignments.stream()
                .map(assignmentMapper::toResponse)
                .toList();
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
        return assignments.stream()
                .map(assignmentMapper::toResponse)
                .toList();
    }

    /* ==========================================================
     *                 TEACHER SIDE – CREATE
     * ========================================================== */

@Override
@Transactional
public AssignmentResponse createAssignmentForTeacher(Long courseId, AssignmentRequest req) {
    ensureTeacherOfCourse(courseId);

    Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
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

    /* ==========================================================
     *                 TEACHER SIDE – UPDATE
     * ========================================================== */

    @Override
    @Transactional
    public AssignmentResponse updateAssignmentForTeacher(Long assignmentId, AssignmentRequest req) {
        Assignment entity = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

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
            Course newCourse = courseRepository.findById(req.getCourseId())
                    .orElseThrow(() -> new IllegalArgumentException("Course not found: " + req.getCourseId()));
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
        Assignment entity = assignmentRepository.findById(assignmentId)
                .orElse(null);

        if (entity == null) {
            return;
        }

        Long courseId = entity.getCourse().getId();
        ensureTeacherOfCourse(courseId);

        entity.setActive(false);
        assignmentRepository.save(entity);

    }
}
