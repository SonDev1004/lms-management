package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.ScheduleItemDTO;
import com.lmsservice.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/teacher/schedule")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping
    public ApiResponse<List<ScheduleItemDTO>> getSchedule(
            @RequestParam String from,
            @RequestParam String to
    ) {
        LocalDate fromDate = LocalDate.parse(from);
        LocalDate toDate = LocalDate.parse(to);

        var result = scheduleService.getTeacherSchedule(fromDate, toDate);

        return ApiResponse.<List<ScheduleItemDTO>>builder()
                .result(result)
                .build();
    }
}

