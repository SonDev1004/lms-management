package com.lmsservice.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
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
    @PreAuthorize("hasAnyRole('ADMIN_IT','ACADEMIC_MANAGER')")
    @PostMapping("/create")
    public ApiResponse<LessonResponse> createLesson(@RequestBody @Valid LessonRequest request) {
        return ApiResponse.<LessonResponse>builder()
                .result(lessonService.createLesson(request))
                .message("Create lesson successfully")
                .build();
    }

    @Operation(
            summary = "Lấy tất cả Lesson",
            description =
                    "API lấy danh sách Lesson theo quyền: Admin thấy tất cả, Giáo viên thấy môn mình dạy, Học sinh thấy môn mình học")
    @PreAuthorize("hasAnyRole('ACADEMIC_MANAGER','ADMIN_IT')")
    @GetMapping("/all-lessons")
    public ApiResponse<Page<LessonResponse>> getAllLessons(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        if (page < 0 || size <= 0) {
            return ApiResponse.<Page<LessonResponse>>builder()
                    .result(null)
                    .message("Invalid pagination parameters: page must be >= 0 and size > 0")
                    .build();
        }
        return ApiResponse.<Page<LessonResponse>>builder()
                .result(lessonService.getAllLessons(page, size))
                .message("Get all lessons successfully")
                .build();
    }

    @Operation(
            summary = "LẤY DANH SÁCH LESSON THEO SUBJECT ID",
            description = "API lấy danh sách Lesson theo Subject ID")
    @GetMapping("/by-subject/{subjectId}")
    public ApiResponse<List<LessonResponse>> getLessonsBySubjectId(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<LessonResponse> lessons = lessonService.getLessonsBySubjectId(subjectId, PageRequest.of(page, size));

        List<LessonResponse> lessonList = lessons.getContent();
        String message = lessonList.isEmpty()
                ? "No lesson found for the given subject id"
                : "Get lessons by subject id successfully";

        return ApiResponse.<List<LessonResponse>>builder()
                .result(lessonList)
                .message(message)
                .build();
    }

    @Operation(summary = "LẤY LESSON THEO ID", description = "API lấy Lesson theo ID")
    @GetMapping("/{lessonId}")
    public ApiResponse<LessonResponse> getLessonById(@PathVariable Long lessonId) {
        return ApiResponse.<LessonResponse>builder()
                .result(lessonService.getLessonById(lessonId))
                .message("Get lesson by id successfully")
                .build();
    }
}
