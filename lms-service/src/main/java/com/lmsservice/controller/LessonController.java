package com.lmsservice.controller;

import java.util.Collections;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.LessonResponse;
import com.lmsservice.service.LessonService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/lesson")
public class LessonController {
    final LessonService lessonService;

    @Operation(summary = "TẠO MỚI LESSON", description = "API TẠO MỚI LESSON")
    @PreAuthorize("hasAnyRole('TEACHER','ACADEMIC_MANAGER')")
    @PostMapping("/create")
    public ApiResponse<LessonResponse> createLesson(@RequestBody @Valid LessonRequest request) {
        return ApiResponse.<LessonResponse>builder()
                .result(lessonService.createLesson(request))
                .message("Create lesson successfully")
                .build();
    }

    @Operation(
            summary = "LẤY DANH SÁCH LESSON THEO SUBJECT ID",
            description = "API lấy danh sách Lesson theo Subject ID")
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ACADEMIC_MANAGER')")
    @GetMapping("/by-subject/{subjectId}")
    public ApiResponse<List<LessonResponse>> getLessonsBySubjectId(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<LessonResponse> lessons = lessonService.getLessonsBySubjectId(subjectId, PageRequest.of(page, size));

        if (lessons.isEmpty()) {
            return ApiResponse.<List<LessonResponse>>builder()
                    .result(Collections.emptyList())
                    .message("No lesson found for the given subject id")
                    .build();
        }

        return ApiResponse.<List<LessonResponse>>builder()
                .result(lessons)
                .message("Get lessons by subject id successfully")
                .build();
    }
}
