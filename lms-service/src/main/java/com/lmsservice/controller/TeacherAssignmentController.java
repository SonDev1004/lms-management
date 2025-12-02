package com.lmsservice.controller;

import java.util.List;

import com.lmsservice.dto.response.AssignmentStudentStatusDto;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.request.AssignmentRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.service.AssignmentService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherAssignmentController {

    AssignmentService assignmentService;

    // ===== LIST BY COURSE =====
    // GET /teacher/courses/{courseId}/assignments
    @Operation(summary = "Giáo viên xem danh sách assignment theo course")
    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/courses/{courseId}/assignments")
    public ApiResponse<List<AssignmentResponse>> getByCourse(@PathVariable Long courseId) {
        List<AssignmentResponse> result = assignmentService.getAssignmentsByCourseForTeacher(courseId);
        return ApiResponse.<List<AssignmentResponse>>builder().result(result).message("Teacher assignments retrieved successfully").build();
    }

    // ===== CREATE =====
    // POST /teacher/courses/{courseId}/assignments
    @Operation(summary = "Giáo viên tạo assignment mới")
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/courses/{courseId}/assignments")
    public ApiResponse<AssignmentResponse> create(@PathVariable Long courseId, @RequestBody AssignmentRequest request) {
        AssignmentResponse result = assignmentService.createAssignmentForTeacher(courseId, request);
        return ApiResponse.<AssignmentResponse>builder().result(result).message("Assignment created successfully").build();
    }

    // ===== UPDATE =====
    // PUT /teacher/assignments/{assignmentId}
    @Operation(summary = "Giáo viên cập nhật assignment")
    @PreAuthorize("hasRole('TEACHER')")
    @PutMapping("/assignments/{assignmentId}")
    public ApiResponse<AssignmentResponse> update(@PathVariable Long assignmentId, @RequestBody AssignmentRequest request) {
        AssignmentResponse result = assignmentService.updateAssignmentForTeacher(assignmentId, request);
        return ApiResponse.<AssignmentResponse>builder().result(result).message("Assignment updated successfully").build();
    }

    @Operation(summary = "Giáo viên gửi bài tập cho học sinh (publish assignment)")
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/assignments/{assignmentId}/publish")
    public ApiResponse<AssignmentResponse> publish(@PathVariable Long assignmentId) {
        AssignmentResponse result = assignmentService.publishAssignment(assignmentId);
        return ApiResponse.<AssignmentResponse>builder()
                .result(result)
                .message("Assignment published successfully")
                .build();
    }

    // ===== DELETE =====
    // DELETE /teacher/assignments/{assignmentId}
    @Operation(summary = "Giáo viên xoá assignment")
    @PreAuthorize("hasRole('TEACHER')")
    @DeleteMapping("/assignments/{assignmentId}")
    public ApiResponse<Void> delete(@PathVariable Long assignmentId) {
        assignmentService.deleteAssignmentForTeacher(assignmentId);
        return ApiResponse.<Void>builder().message("Assignment deleted successfully").build();
    }

    @Operation(summary = "Giáo viên xem danh sách học sinh / trạng thái nộp cho 1 assignment")
    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/assignments/{assignmentId}/students")
    public ApiResponse<List<AssignmentStudentStatusDto>> getStudentsForAssignment(
            @PathVariable Long assignmentId
    ) {
        List<AssignmentStudentStatusDto> result =
                assignmentService.getAssignmentStudentsForTeacher(assignmentId);

        return ApiResponse.<List<AssignmentStudentStatusDto>>builder()
                .result(result)
                .message("Assignment student statuses retrieved")
                .build();
    }

    @Operation(summary = "Giáo viên nhắc những học sinh chưa nộp bài")
    @PreAuthorize("hasRole('TEACHER')")
    @PostMapping("/assignments/{assignmentId}/remind-not-submitted")
    public ApiResponse<Void> remindNotSubmitted(@PathVariable Long assignmentId) {
        assignmentService.remindNotSubmittedStudents(assignmentId);
        return ApiResponse.<Void>builder()
                .message("Reminders sent successfully")
                .build();
    }
}
