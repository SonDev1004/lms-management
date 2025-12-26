package com.lmsservice.controller;

import com.lmsservice.dto.request.ApproveMakeUpRequestRequest;
import com.lmsservice.dto.request.MarkMakeUpAttendedRequest;
import com.lmsservice.dto.request.RejectMakeUpRequestRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AvailableMakeUpSessionResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.service.MakeUpRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasAnyRole('ACADEMIC_MANAGER','ADMIN_IT')")
@RestController
@RequestMapping("/api/admin/makeup-requests")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminMakeUpRequestController {

    MakeUpRequestService makeUpRequestService;

    @GetMapping
    public ApiResponse<Page<MakeUpRequestResponse>> getPage(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<MakeUpRequestResponse> p =
                makeUpRequestService.getForAdmin(status, courseId, PageRequest.of(page, size));

        return ApiResponse.<Page<MakeUpRequestResponse>>builder()
                .result(p)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<MakeUpRequestResponse> detail(@PathVariable Long id) {
        MakeUpRequestResponse r = makeUpRequestService.getDetailForAdmin(id);
        return ApiResponse.<MakeUpRequestResponse>builder()
                .result(r)
                .message("Chi tiết yêu cầu học bù")
                .build();
    }

    @GetMapping("/{id}/available-sessions")
    public ApiResponse<List<AvailableMakeUpSessionResponse>> availableForRequest(@PathVariable Long id) {
        var list = makeUpRequestService.getAvailableMakeupSessionsForAdmin(id);
        return ApiResponse.<List<AvailableMakeUpSessionResponse>>builder()
                .result(list)
                .message("Danh sách buổi học bù khả dụng cho yêu cầu")
                .build();
    }

    @PostMapping("/{id}/approve")
    public ApiResponse<MakeUpRequestResponse> approve(
            @PathVariable Long id,
            @Valid @RequestBody ApproveMakeUpRequestRequest request
    ) {
        MakeUpRequestResponse result = makeUpRequestService.approve(id, request);
        return ApiResponse.<MakeUpRequestResponse>builder()
                .result(result)
                .message("Đã duyệt yêu cầu học bù")
                .build();
    }

    // NEW: reject
    @PostMapping("/{id}/reject")
    public ApiResponse<MakeUpRequestResponse> reject(
            @PathVariable Long id,
            @RequestBody RejectMakeUpRequestRequest request
    ) {
        MakeUpRequestResponse result = makeUpRequestService.reject(id, request);
        return ApiResponse.<MakeUpRequestResponse>builder()
                .result(result)
                .message("Đã từ chối yêu cầu học bù")
                .build();
    }

    @PostMapping("/{id}/mark-attended")
    public ApiResponse<MakeUpRequestResponse> markAttended(
            @PathVariable Long id,
            @RequestBody MarkMakeUpAttendedRequest request
    ) {
        MakeUpRequestResponse result = makeUpRequestService.markAttended(id, request);

        return ApiResponse.<MakeUpRequestResponse>builder()
                .result(result)
                .message("Đã xác nhận học bù và cập nhật điểm danh")
                .build();
    }
}
