package com.lmsservice.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.service.AssignmentService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/assignment")
public class AssignmentController {
    AssignmentService assignmentService;

    // Student thì lấy assignment đang active và CHỈ LẤY theo course Student đã đăng ký
    // Teacher thì lấy tất cả assignment
    @Operation(summary = "Lấy assignment theo courseId")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER')")
    @GetMapping("/assignment-by-course/{courseId}")
    public ApiResponse<List<AssignmentResponse>> getAssignmentByCourseId(@PathVariable Long courseId) {
        List<AssignmentResponse> response = assignmentService.getAssignmentsByCourseId(courseId);
        return ApiResponse.<List<AssignmentResponse>>builder()
                .result(response)
                .message("Assignments retrieved successfully")
                .build();
    }
}
