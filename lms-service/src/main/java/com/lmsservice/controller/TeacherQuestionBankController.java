package com.lmsservice.controller;

import com.lmsservice.dto.request.CreateMcqQuestionRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.QuestionBankSummaryDto;
import com.lmsservice.entity.QuestionBank;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.QuestionBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Question bank cho giáo viên / Academic Manager
 * - Tạo câu hỏi mới
 * - Ẩn (deactivate) câu hỏi
 * - Tìm kiếm danh sách câu hỏi
 */
@PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
@RestController
@RequestMapping("/api/teacher/question-bank")
@RequiredArgsConstructor
public class TeacherQuestionBankController {

    private final QuestionBankService questionBankService;
    private final CurrentUserService currentUserService;

    /**
     * Tạo 1 câu MCQ (1 đáp án đúng)
     */
    @PostMapping("/mcq-single")
    public ResponseEntity<ApiResponse<QuestionBank>> createMcqSingle(
            @RequestBody CreateMcqQuestionRequest req
    ) {
        Long userId = currentUserService.requireUserId();

        QuestionBank qb = questionBankService.createMcqSingle(req, userId);

        ApiResponse<QuestionBank> resp = ApiResponse.<QuestionBank>builder()
                .message("Tạo câu hỏi trắc nghiệm thành công")
                .result(qb)
                .build();

        return ResponseEntity.ok(resp);
    }

    /**
     * Ẩn / deactivate câu hỏi trong ngân hàng đề
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        questionBankService.deactivate(id);

        ApiResponse<Void> resp = ApiResponse.<Void>builder()
                .message("Ẩn câu hỏi thành công")
                .build();

        return ResponseEntity.ok(resp);
    }

    /**
     * Tìm kiếm câu hỏi trong ngân hàng đề
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuestionBankSummaryDto>>> listQuestions(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        currentUserService.requireUserId();

        PageRequest pageable = PageRequest.of(page, size);
        Page<QuestionBankSummaryDto> data =
                questionBankService.searchQuestions(subjectId, type, active, keyword, pageable);

        ApiResponse<Page<QuestionBankSummaryDto>> resp =
                ApiResponse.<Page<QuestionBankSummaryDto>>builder()
                        .message("Danh sách câu hỏi ngân hàng đề")
                        .result(data)
                        .build();

        return ResponseEntity.ok(resp);
    }
}
