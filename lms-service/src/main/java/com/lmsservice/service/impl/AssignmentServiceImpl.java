package com.lmsservice.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.mapper.AssignmentMapper;
import com.lmsservice.repository.AssignmentRepository;
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

    @Override
    public List<AssignmentResponse> getAssignmentsByCourseId(Long courseId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser =
                userRepository.findByUserName(username).orElseThrow(() -> new RuntimeException("User not found"));

        boolean isTeacher = "TEACHER".equals(currentUser.getRole().getName());
        List<Assignment> assignments;
        if (isTeacher) {
            assignments = assignmentRepository.findByCourseId(courseId);
        } else {
            boolean enRolled = courseStudentRepository.existsByCourseIdAndStudentId(courseId, currentUser.getId());
            if (!enRolled) {
                throw new UnAuthorizeException(ErrorCode.STUDENT_IS_NOT_ENROLLED);
            }
            assignments = assignmentRepository.findByCourseIdAndIsActiveTrue(courseId);
        }

        return assignments.stream().map(assignmentMapper::toResponse).toList();
    }
}
