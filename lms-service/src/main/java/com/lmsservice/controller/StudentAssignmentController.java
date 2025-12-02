package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.StudentAssignmentItemResponse;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping("/api/student/courses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@RestController
public class StudentAssignmentController {

    private final AssignmentService assignmentService;
    private final CurrentUserService currentUserService;

    @GetMapping("/{courseId}/assignments")
    public ResponseEntity<ApiResponse<List<StudentAssignmentItemResponse>>> getAssignmentsForStudent(@PathVariable Long courseId) {
        Long studentId = currentUserService.requireStudentId();

        List<StudentAssignmentItemResponse> data = assignmentService.getAssignmentsForStudent(courseId, studentId);

        ApiResponse<List<StudentAssignmentItemResponse>> resp = ApiResponse.<List<StudentAssignmentItemResponse>>builder().code(1000).message("Lấy danh sách assignment cho học sinh thành công").result(data).build();

        return ResponseEntity.ok(resp);
    }
}
