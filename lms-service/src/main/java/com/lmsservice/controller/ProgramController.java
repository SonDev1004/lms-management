package com.lmsservice.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.ApiResponse;
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
}
