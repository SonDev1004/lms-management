package com.lmsservice.security.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import com.lmsservice.entity.Course;
import com.lmsservice.entity.Session;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.security.CurrentUserService;

import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class TeacherPermissionAspect {

    private final CourseRepository courseRepository;
    private final SessionRepository sessionRepository;
    private final CurrentUserService currentUserService;

    @Before("@annotation(com.lmsservice.security.annotation.CheckTeacherPermission)")
    public void checkTeacherPermission(JoinPoint joinPoint) {

        Long teacherId = currentUserService.requireTeacherId();

        // lấy tất cả tham số method
        Object[] args = joinPoint.getArgs();

        // tìm courseId hoặc sessionId trong tham số
        Long courseId = null;
        Long sessionId = null;

        for (Object arg : args) {
            if (arg instanceof Long id) {
                // nếu method có param tên courseId
                if (joinPoint.getSignature().toString().contains("courseId")) {
                    courseId = id;
                }
                // nếu method có param tên sessionId
                if (joinPoint.getSignature().toString().contains("sessionId")) {
                    sessionId = id;
                }
            }
        }

        // Ưu tiên check theo sessionId nếu có
        if (sessionId != null) {
            Session session = sessionRepository
                    .findById(sessionId)
                    .orElseThrow(() -> new AppException(ErrorCode.SESSION_NOT_FOUND));

            Course course = session.getCourse();
            if (!course.getTeacher().getId().equals(teacherId)) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            return;
        }

        // Nếu không có sessionId thì check theo courseId
        if (courseId != null) {
            Course course =
                    courseRepository.findById(courseId).orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

            if (!course.getTeacher().getId().equals(teacherId)) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
    }
}
