package com.lmsservice.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.SessionInfoDTO;
import com.lmsservice.service.CourseService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/courses")
public class CourseController {
    CourseService courseService;

    @GetMapping("/{courseId}/sessions")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    public ApiResponse<List<SessionInfoDTO>> getSessions(@PathVariable Long courseId) {
        List<SessionInfoDTO> sessions = courseService.getSessions(courseId);
        return ApiResponse.<List<SessionInfoDTO>>builder()
                .message("Lấy danh sách session thành công")
                .result(sessions)
                .build();
    }
}
