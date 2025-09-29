package com.lmsservice.controller;

import jakarta.validation.Valid;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.course.TeacherCourseFilterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.course.TeacherCourse;
import com.lmsservice.service.TeacherService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/teacher")
public class TeacherController {
    TeacherService teacherService;

    @PreAuthorize("hasRole('TEACHER')")
    @GetMapping("/me/courses")
    public ResponseEntity<ApiResponse<PageResponse<TeacherCourse>>> getMyCourses(
            @Valid @ParameterObject TeacherCourseFilterRequest filter, @ParameterObject Pageable pageable) {

        var result = teacherService.getTeacherCourses(filter, pageable);
        return ResponseEntity.ok(ApiResponse.<PageResponse<TeacherCourse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get teacher courses successfully")
                .result(result)
                .build());
    }
}
