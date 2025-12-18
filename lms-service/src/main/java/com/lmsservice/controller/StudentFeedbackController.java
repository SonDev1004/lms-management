package com.lmsservice.controller;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CreateFeedbackRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.FeedbackResponse;

import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.FeedbackService;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/feedback")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('STUDENT')")
public class StudentFeedbackController {

    FeedbackService feedbackService;
    CurrentUserService currentUserService;

    // STUDENT gửi feedback
    @PostMapping
    public ApiResponse<FeedbackResponse> create(@RequestBody CreateFeedbackRequest request) {
        Long studentId = currentUserService.requireStudentId();
        var res = feedbackService.createFeedback(studentId, request);
        return ApiResponse.<FeedbackResponse>builder().message("Create feedback successfully").result(res).build();
    }

    // STUDENT xem feedback của chính mình
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<FeedbackResponse>>> getMyFeedbacks(@ParameterObject Pageable pageable) {
        Long studentId = currentUserService.requireStudentId();
        var page = feedbackService.getFeedbacksOfStudent(studentId, pageable);
        return ResponseEntity.ok(ApiResponse.<PageResponse<FeedbackResponse>>builder().result(page).build());
    }
}
