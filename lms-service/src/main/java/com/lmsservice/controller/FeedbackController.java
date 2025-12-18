package com.lmsservice.controller;

import com.lmsservice.common.paging.PageResponse;

import com.lmsservice.dto.request.FeedbackFilterRequest;
import com.lmsservice.dto.response.ApiResponse;

import com.lmsservice.dto.response.FeedbackResponse;
import com.lmsservice.service.FeedbackService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/feedback")
public class FeedbackController {
    FeedbackService feedbackService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ACADEMIC_MANAGER','ADMIN_IT')")
    public ResponseEntity<ApiResponse<PageResponse<FeedbackResponse>>> getFeedbacks(
            @ParameterObject FeedbackFilterRequest filter,
            @ParameterObject Pageable pageable
    ) {
        var page = feedbackService.getFeedbacks(filter, pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<FeedbackResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .message("Get feedback list successfully")
                        .result(page)
                        .build()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ACADEMIC_MANAGER','ADMIN_IT')")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedbackDetail(@PathVariable Long id) {
        var dto = feedbackService.getFeedbackDetail(id);
        return ResponseEntity.ok(
                ApiResponse.<FeedbackResponse>builder()
                        .code(HttpStatus.OK.value())
                        .message("Get feedback detail successfully")
                        .result(dto)
                        .build()
        );
    }
}
