package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AssignmentQuestionConfig;
import com.lmsservice.dto.response.AssignmentQuizConfigResponse;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.AssignmentQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Cấu hình quiz cho assignment
 * - Lưu danh sách câu hỏi (mapping từ question_bank sang assignment_detail)
 * - Đọc lại cấu hình quiz của 1 assignment
 */
@PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
@RestController
@RequestMapping("/api/teacher/assignments")
@RequiredArgsConstructor
public class TeacherAssignmentQuizController {

    private final AssignmentQuizService assignmentQuizService;
    private final CurrentUserService currentUserService;

    /**
     * Lưu cấu hình quiz cho 1 assignment
     */
    @PostMapping("/{assignmentId}/quiz-config")
    public ResponseEntity<ApiResponse<Void>> saveQuizConfig(
            @PathVariable Long assignmentId,
            @RequestBody List<AssignmentQuestionConfig> items
    ) {
        currentUserService.requireUserId();

        assignmentQuizService.configureAssignmentQuestions(assignmentId, items);

        ApiResponse<Void> resp = ApiResponse.<Void>builder()
                .message("Lưu cấu hình quiz cho assignment thành công")
                .build();

        return ResponseEntity.ok(resp);
    }

    /**
     * Lấy cấu hình quiz của 1 assignment
     */
    @GetMapping("/{assignmentId}/quiz-config")
    public ResponseEntity<ApiResponse<AssignmentQuizConfigResponse>> getQuizConfig(
            @PathVariable Long assignmentId
    ) {
        currentUserService.requireUserId();

        AssignmentQuizConfigResponse data = assignmentQuizService.getQuizConfig(assignmentId);

        ApiResponse<AssignmentQuizConfigResponse> resp =
                ApiResponse.<AssignmentQuizConfigResponse>builder()
                        .message("Lấy cấu hình quiz cho assignment thành công")
                        .result(data)
                        .build();

        return ResponseEntity.ok(resp);
    }
}
