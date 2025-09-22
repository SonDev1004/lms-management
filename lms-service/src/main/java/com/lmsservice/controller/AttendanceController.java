package com.lmsservice.controller;

import java.time.LocalDate;
import java.util.List;

import com.lmsservice.dto.request.MarkAttendanceRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AttendanceSummaryDTO;
import com.lmsservice.service.AttendanceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;


    @Operation(summary = "Lấy danh sách")
    @GetMapping("/by-date")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<List<AttendanceItemDTO>> getAttendanceByDate(
            @RequestParam Long courseId, @RequestParam(required = false) String date) {
        List<AttendanceItemDTO> data = attendanceService.getAttendanceByDate(courseId,
                date);
        return ApiResponse.<List<AttendanceItemDTO>>builder()
                .message("Lấy danh sách điểm danh thành công")
                .result(data)
                .build();
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<AttendanceSummaryDTO> getAttendanceSummary(@RequestParam Long courseId) {
        AttendanceSummaryDTO summary = attendanceService.getAttendanceSummary(courseId);
        return ApiResponse.<AttendanceSummaryDTO>builder()
                .message("Lấy tổng hợp điểm danh thành công")
                .result(summary)
                .build();
    }

    @Operation(summary = "Điểm danh")
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<String> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        attendanceService.markAttendance(request);
        return ApiResponse.<String>builder()
                .message("Điểm danh thành công")
                .result("OK")
                .build();
    }
}
