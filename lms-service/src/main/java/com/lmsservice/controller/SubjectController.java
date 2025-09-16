package com.lmsservice.controller;

import jakarta.validation.Valid;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.request.subject.SubjectFilterRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.subject.SubjectDetailResponse;
import com.lmsservice.dto.response.subject.SubjectResponse;
import com.lmsservice.service.SubjectService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/subject")
public class SubjectController {
    SubjectService subjectService;

    @PreAuthorize("hasRole('ACADEMIC_MANAGER')")
    @PostMapping("/create")
    @Operation(
            summary = "Tạo môn học mới",
            description =
                    "API dùng để tạo một môn học mới, bao gồm tiêu đề, số buổi, học phí, số lượng học viên, mô tả và ảnh minh hoạ.")
    public ResponseEntity<ApiResponse> createSubject(@Valid @RequestBody CreateSubjectRequest requestDTO) {
        SubjectResponse responseDTO = subjectService.createSubject(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SubjectResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Subject created successfully")
                        .result(responseDTO)
                        .build());
    }

    @Operation(summary = "Lấy danh sách môn học", description = "Lọc / search / sort / paging các môn học")
    @GetMapping("/all-subject")
    public ResponseEntity<ApiResponse<PageResponse<SubjectResponse>>> getAllSubjects(
            @ParameterObject SubjectFilterRequest f,
            @ParameterObject @PageableDefault(size = 10, sort = "id") Pageable pageable) {

        var response = subjectService.getAllSubjects(f, pageable);
        return ResponseEntity.ok(ApiResponse.<PageResponse<SubjectResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get all subjects successfully")
                .result(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectDetailResponse>> getSubjectDetail(
            @PathVariable Long id, @RequestParam(defaultValue = "true") boolean onlyUpcoming) {
        var result = subjectService.getDetail(id, onlyUpcoming);
        return ResponseEntity.ok(ApiResponse.<SubjectDetailResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get subject detail successfully")
                .result(result)
                .build());
    }
}
