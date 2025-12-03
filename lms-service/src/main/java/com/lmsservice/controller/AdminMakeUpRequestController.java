package com.lmsservice.controller;

import com.lmsservice.dto.request.MarkMakeUpAttendedRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.MakeUpRequestResponse;
import com.lmsservice.service.MakeUpRequestService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
