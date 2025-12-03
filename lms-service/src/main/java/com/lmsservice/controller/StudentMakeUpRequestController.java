package com.lmsservice.controller;

import com.lmsservice.dto.request.CreateMakeUpRequestRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.service.MakeUpRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/makeup-requests")
@RequiredArgsConstructor
public class StudentMakeUpRequestController {

    private final MakeUpRequestService makeUpRequestService;

    @PostMapping("/create")
    public ApiResponse<MakeUpRequestResponse> create(@RequestBody CreateMakeUpRequestRequest request) {
        MakeUpRequestResponse result = makeUpRequestService.createForCurrentStudent(request);

        return ApiResponse.<MakeUpRequestResponse>builder()
                .message("Gửi yêu cầu học bù thành công")
                .result(result)
                .build();
    }
}
