package com.lmsservice.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CurriculumRequest;
import com.lmsservice.dto.request.program.ProgramFilterRequest;
import com.lmsservice.dto.request.program.ProgramRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.CurriculumResponse;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.service.ProgramService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/program")
public class ProgramController {
    ProgramService programService;

    // API create program
    @PreAuthorize("hasRole('ACADEMIC_MANAGER')")
    @PostMapping("/create")
    @Operation(
            summary = "Tạo chương trình học",
            description =
                    "Tạo mới một chương trình học với thông tin như tên, số lượng học viên, học phí và trạng thái")
    public ResponseEntity<ApiResponse> createProgram(@Valid @RequestBody ProgramRequest programRequestDTO) {

        ProgramResponse response = programService.createProgram(programRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Program created successfully")
                        .result(response)
                        .build());
    }

    // API add subject to program
    @PreAuthorize("hasRole('ACADEMIC_MANAGER')")
    @PostMapping("/{programId}/curriculum")
    @Operation(
            summary = "Gán danh sách môn học vào chương trình",
            description =
                    "API dùng để thêm 1 hoặc nhiều môn học vào chương trình học thông qua curriculum. Thứ tự sẽ được tự động tính tiếp theo.")
    public ResponseEntity<ApiResponse> addSubjectsToProgram(
            @PathVariable Long programId, @Valid @RequestBody List<CurriculumRequest> requests) {
        List<CurriculumResponse> response = programService.addSubjectsToProgram(programId, requests);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Subjects added to program successfully")
                        .result(response)
                        .build());
    }

    @Operation(summary = "Lấy danh sách chương trình học", description = "Lọc/search/sort/paging các chương trình học")
    @GetMapping("/all-program")
    public ResponseEntity<ApiResponse<PageResponse<ProgramResponse>>> getProgram(
            @ParameterObject ProgramFilterRequest f, @ParameterObject Pageable pageable) {
        var response = programService.getAllPrograms(f, pageable);
        return ResponseEntity.ok(ApiResponse.<PageResponse<ProgramResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get all programs successfully")
                .result(response)
                .build());
    }
}
