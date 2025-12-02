// com.lmsservice.controller.StudentAttendanceController.java
package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.StudentAttendanceOverviewResponse;
import com.lmsservice.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/attendance")
@RequiredArgsConstructor
public class StudentAttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/overview")
    public ApiResponse<StudentAttendanceOverviewResponse> getOverview() {
        StudentAttendanceOverviewResponse result =
                attendanceService.getStudentAttendanceOverview();

        return ApiResponse.<StudentAttendanceOverviewResponse>builder()
                .result(result)
                .build();
    }
}
