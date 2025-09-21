package com.lmsservice.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/by-date")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<List<AttendanceItemDTO>> getAttendanceByDate(
            @RequestParam Long courseId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceItemDTO> data = attendanceService.getAttendanceByDate(courseId, date);
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
}
