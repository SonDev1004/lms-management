package com.lmsservice.service;

import org.springframework.data.domain.Pageable;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CreateFeedbackRequest;
import com.lmsservice.dto.request.FeedbackFilterRequest;
import com.lmsservice.dto.response.FeedbackResponse;

public interface FeedbackService {

    // Academic/Admin xem list + detail
    PageResponse<FeedbackResponse> getFeedbacks(FeedbackFilterRequest filter, Pageable pageable);

    FeedbackResponse getFeedbackDetail(Long id);

    // STUDENT gửi feedback
    FeedbackResponse createFeedback(Long studentId, CreateFeedbackRequest request);

    // STUDENT xem list feedback của chính mình
    PageResponse<FeedbackResponse> getFeedbacksOfStudent(Long studentId, Pageable pageable);
}
