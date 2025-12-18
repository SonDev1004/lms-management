package com.lmsservice.controller;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.LatestEnrollmentFilterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.LatestEnrollmentItemResponse;
import com.lmsservice.service.EnrollmentService;
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
@RequestMapping("/api/admin/enrollments/latest")
public class EnrollmentController {
    EnrollmentService enrollmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN_IT')")
    public ResponseEntity<ApiResponse<PageResponse<LatestEnrollmentItemResponse>>> list(
            @ParameterObject LatestEnrollmentFilterRequest filter,
            @ParameterObject Pageable pageable
    ) {
        var page = enrollmentService.getLatestEnrollments(filter, pageable);
        return ResponseEntity.ok(
                ApiResponse.<PageResponse<LatestEnrollmentItemResponse>>builder()
                        .code(HttpStatus.OK.value())
                        .result(page)
                        .build()
        );
    }
}
