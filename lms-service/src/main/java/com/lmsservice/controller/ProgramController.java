package com.lmsservice.controller;

import com.lmsservice.dto.request.ProgramRequestDTO;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.ProgramResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createProgram(@Valid @RequestBody ProgramRequestDTO programRequestDTO) {

        ProgramResponseDTO response = programService.createProgram(programRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Program created successfully")
                        .result(response)
                        .build());
    }
}
