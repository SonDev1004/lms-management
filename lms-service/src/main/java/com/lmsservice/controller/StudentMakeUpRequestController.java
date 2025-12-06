package com.lmsservice.controller;

import com.lmsservice.dto.request.CreateAssignmentRetakeRequest;
import com.lmsservice.dto.request.CreateMakeUpRequestRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.AssignmentRetakeService;
import com.lmsservice.service.MakeUpRequestService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/makeup-requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StudentMakeUpRequestController {

    MakeUpRequestService makeUpRequestService;
    AssignmentRetakeService assignmentRetakeService;
    CurrentUserService currentUserService;

    @PostMapping("/create")
    public ApiResponse<MakeUpRequestResponse> create(
            @RequestBody CreateMakeUpRequestRequest request
    ) {
        MakeUpRequestResponse result = makeUpRequestService.createForCurrentStudent(request);

        return ApiResponse.<MakeUpRequestResponse>builder()
                .message("Gửi yêu cầu học bù thành công")
                .result(result)
                .build();
    }


    @PostMapping("/assignments/{assignmentId}/retake-request")
    public ApiResponse<Void> requestAssignmentRetake(
            @PathVariable Long assignmentId,
            @Valid @RequestBody CreateAssignmentRetakeRequest body
    ) {
        Long studentId = currentUserService.requireStudentId();
        assignmentRetakeService.requestRetake(assignmentId, studentId, body.getReason());

        return ApiResponse.<Void>builder()
                .message("Gửi yêu cầu thi lại thành công")
                .result(null)
                .build();
    }
}
