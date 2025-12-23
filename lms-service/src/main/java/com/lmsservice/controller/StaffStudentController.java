package com.lmsservice.controller;

import com.lmsservice.dto.response.*;
import com.lmsservice.service.StaffStudentProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/students")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
public class StaffStudentController {

    StaffStudentProfileService service;

    @GetMapping("/{userId}/profile")
    public ApiResponse<StaffUserProfileResponse> getProfile(@PathVariable Long userId) {
        return ApiResponse.<StaffUserProfileResponse>builder()
                .message("Get student profile successfully")
                .result(service.getStudentProfile(userId))
                .build();
    }

    @GetMapping("/{userId}/courses")
    public ApiResponse<List<StaffCourseBriefResponse>> getCourses(@PathVariable Long userId) {
        return ApiResponse.<List<StaffCourseBriefResponse>>builder()
                .message("Get student courses successfully")
                .result(service.getStudentCourses(userId))
                .build();
    }

    @GetMapping("/{userId}/attendance/overview")
    public ApiResponse<StudentAttendanceOverviewResponse> getAttendanceOverview(
            @PathVariable Long userId,
            @RequestParam Long courseId
    ) {
        return ApiResponse.<StudentAttendanceOverviewResponse>builder()
                .message("Get student attendance overview successfully")
                .result(service.getAttendanceSummary(userId, courseId))
                .build();
    }

    @GetMapping("/{userId}/attendance/details")
    public ApiResponse<List<StudentAttendanceDetailDTO>> getAttendanceDetails(
            @PathVariable Long userId,
            @RequestParam Long courseId
    ) {
        return ApiResponse.<List<StudentAttendanceDetailDTO>>builder()
                .message("Get student attendance details successfully")
                .result(service.getAttendanceDetails(userId, courseId))
                .build();
    }
}

