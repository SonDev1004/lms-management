package com.lmsservice.security.policy;

import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.lmsservice.entity.Student;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.security.CustomUserDetails;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StudentPolicy {
    private final StudentRepository studentRepository;

    public boolean canReadCourses(Authentication auth, Long pathStudentId) {
        if (auth == null || !auth.isAuthenticated()) return false;

        // Chỉ sinh viên mới dùng API này (SecurityConfig đã chặn role khác),
        // nhưng ta vẫn cẩn thận kiểm tra principal.
        Object principal = auth.getPrincipal();
        if (!(principal instanceof CustomUserDetails cud)) return false;

        Long currentUserId = cud.getUser().getId();
        Long myStudentId = studentRepository
                .findByUserId(currentUserId)
                .map(Student::getId)
                .orElse(null);

        // Chỉ được xem đúng "mình"
        return Objects.equals(myStudentId, pathStudentId);
    }
}
