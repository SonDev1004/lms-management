package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.StudentAttendanceDetailDTO;
import com.lmsservice.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@PreAuthorize("hasRole('STUDENT')")
@RestController
@RequestMapping("/api/student/courses")
@RequiredArgsConstructor
public class CourseStudentController {
    private final AttendanceService attendanceService;

    @GetMapping("/{courseId}/sessions")
    public ApiResponse<List<StudentAttendanceDetailDTO>> getCourseSessions(
            @PathVariable Long courseId
    ) {
        var res = attendanceService.getStudentAttendanceDetails(courseId);
        return ApiResponse.<List<StudentAttendanceDetailDTO>>builder()
                .result(res)
                .build();
    }
}
