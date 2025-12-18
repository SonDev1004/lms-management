package com.lmsservice.service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.LatestEnrollmentFilterRequest;
import com.lmsservice.dto.response.LatestEnrollmentItemResponse;
import org.springframework.data.domain.Pageable;


public interface EnrollmentService {

    PageResponse<LatestEnrollmentItemResponse> getLatestEnrollments(
            LatestEnrollmentFilterRequest filter,
            Pageable pageable
    );
}
