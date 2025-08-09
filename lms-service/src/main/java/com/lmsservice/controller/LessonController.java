package com.lmsservice.controller;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.LessonResponse;
import com.lmsservice.service.LessonService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/lesson")
public class LessonController {
    final LessonService lessonService;

    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    @PostMapping("/create")
    public ApiResponse<LessonResponse> createLesson(@RequestBody @Valid LessonRequest request) {
        return ApiResponse.<LessonResponse>builder()
                .result(lessonService.createLesson(request))
                .message("Create lesson successfully")
                .build();
    }
}
