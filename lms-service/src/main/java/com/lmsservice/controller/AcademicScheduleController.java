package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.ScheduleItemDTO;
import com.lmsservice.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ACADEMIC_MANAGER', 'ADMIN_IT')")
public class AcademicScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/schedule")
    public ApiResponse<List<ScheduleItemDTO>> getAcademySchedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ApiResponse.<List<ScheduleItemDTO>>builder()
                .message("Lấy lịch cho Academic Manager thành công")
                .result(scheduleService.getAcademySchedule(from, to))
                .build();
    }
}

