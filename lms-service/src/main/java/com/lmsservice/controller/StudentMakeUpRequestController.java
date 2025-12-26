package com.lmsservice.controller;

import com.lmsservice.dto.request.CreateAssignmentRetakeRequest;
import com.lmsservice.dto.request.CreateMakeUpRequestRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AvailableMakeUpSessionResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.security.CurrentUserService;
import com.lmsservice.service.AssignmentRetakeService;
import com.lmsservice.service.MakeUpRequestService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            @Valid @RequestBody CreateMakeUpRequestRequest request
    ) {
        MakeUpRequestResponse result = makeUpRequestService.createForCurrentStudent(request);
        return ApiResponse.<MakeUpRequestResponse>builder()
                .message("Gửi yêu cầu học bù thành công")
                .result(result)
                .build();
    }

    @GetMapping("/available-sessions")
    public ApiResponse<List<AvailableMakeUpSessionResponse>> availableSessions(
            @RequestParam Long missedSessionId
    ) {
        var list = makeUpRequestService.getAvailableMakeupSessionsForStudent(missedSessionId);
        return ApiResponse.<List<AvailableMakeUpSessionResponse>>builder()
                .result(list)
                .message("Danh sách buổi học bù khả dụng")
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

    @PostMapping("/{id}/select-preferred-session")
    public ApiResponse<MakeUpRequestResponse> selectPreferred(
            @PathVariable Long id,
            @RequestParam Long preferredSessionId
    ) {
        MakeUpRequestResponse result = makeUpRequestService.selectPreferredSession(id, preferredSessionId);
        return ApiResponse.<MakeUpRequestResponse>builder()
                .message("Đã chọn buổi học bù mong muốn")
                .result(result)
                .build();
    }

    @GetMapping
    public ApiResponse<Page<MakeUpRequestResponse>> myRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<MakeUpRequestResponse> p =
                makeUpRequestService.getForStudent(status, courseId, PageRequest.of(page, size));

        return ApiResponse.<Page<MakeUpRequestResponse>>builder()
                .result(p)
                .message("Danh sách yêu cầu học bù của bạn")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<MakeUpRequestResponse> detail(@PathVariable Long id) {
        MakeUpRequestResponse r = makeUpRequestService.getDetailForStudent(id);
        return ApiResponse.<MakeUpRequestResponse>builder()
                .result(r)
                .message("Chi tiết yêu cầu học bù")
                .build();
    }

}
