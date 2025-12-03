package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.StudentAttendanceDetailDTO;
import com.lmsservice.dto.response.StudentAttendanceOverviewResponse;
import com.lmsservice.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/attendance")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/overview")
    public ApiResponse<StudentAttendanceOverviewResponse> getOverview() {
        StudentAttendanceOverviewResponse dto =
                attendanceService.getStudentAttendanceOverview();

        return ApiResponse.<StudentAttendanceOverviewResponse>builder()
                .result(dto)
                .build();
    }
    @GetMapping("/details")
    public ApiResponse<List<StudentAttendanceDetailDTO>> getDetails(
            @RequestParam(required = false) Long courseId
    ) {
        var res = attendanceService.getStudentAttendanceDetails(courseId);
        return ApiResponse.<List<StudentAttendanceDetailDTO>>builder()
                .result(res)
                .build();
    }
}

