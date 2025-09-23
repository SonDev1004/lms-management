package com.lmsservice.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.request.MarkAttendanceRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.AttendanceItemDTO;
import com.lmsservice.dto.response.AttendanceSummaryDTO;
import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.service.AttendanceService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * 🔹 Lấy danh sách session theo ngày của course
     */
    @Operation(summary = "Lấy danh sách session trong ngày")
    @GetMapping("/sessions")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<List<SessionInfoDTO>> getSessionsByDate(@RequestParam Long courseId, @RequestParam String date) {

        List<SessionInfoDTO> data = attendanceService.getSessionsByDate(courseId, date);
        return ApiResponse.<List<SessionInfoDTO>>builder()
                .message("Lấy danh sách session thành công")
                .result(data)
                .build();
    }

    /**
     * 🔹 Lấy danh sách điểm danh của session
     */
    @Operation(summary = "Lấy danh sách điểm danh theo session")
    @GetMapping("/by-session")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<List<AttendanceItemDTO>> getAttendanceBySession(@RequestParam Long sessionId) {
        List<AttendanceItemDTO> data = attendanceService.getAttendanceBySession(sessionId);
        return ApiResponse.<List<AttendanceItemDTO>>builder()
                .message("Lấy danh sách điểm danh thành công")
                .result(data)
                .build();
    }

    /**
     * 🔹 Lưu điểm danh cho session
     */
    @Operation(summary = "Điểm danh cho session")
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<String> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        attendanceService.markAttendance(request);
        return ApiResponse.<String>builder()
                .message("Điểm danh thành công")
                .result("OK")
                .build();
    }

    /**
     * 🔹 Tổng hợp điểm danh toàn course
     */
    @Operation(summary = "Xem tổng hợp điểm danh toàn course")
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
