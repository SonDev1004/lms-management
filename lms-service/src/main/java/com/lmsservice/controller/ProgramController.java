package com.lmsservice.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lmsservice.dto.request.CurriculumRequest;
import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.CurriculumResponse;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.service.ProgramService;

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
    @PostMapping("/{programId}/add-subject")
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
}
