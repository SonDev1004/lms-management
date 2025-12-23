package com.lmsservice.controller;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.StaffCourseBriefResponse;
import com.lmsservice.dto.response.StaffUserProfileResponse;
import com.lmsservice.service.StaffTeacherProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/teachers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasAnyRole('ADMIN_IT', 'ACADEMIC_MANAGER')")
public class StaffTeacherController {

    StaffTeacherProfileService service;


    @GetMapping("/{userId}/profile")
    public ApiResponse<StaffUserProfileResponse> getProfile(@PathVariable Long userId) {
        return ApiResponse.<StaffUserProfileResponse>builder()
                .message("Get teacher profile successfully")
                .result(service.getTeacherProfile(userId))
                .build();
    }

    @GetMapping("/{userId}/courses")
    public ApiResponse<List<StaffCourseBriefResponse>> getCourses(@PathVariable Long userId) {
        return ApiResponse.<List<StaffCourseBriefResponse>>builder()
                .message("Get teacher courses successfully")
                .result(service.getTeacherCourses(userId))
                .build();
    }
}
