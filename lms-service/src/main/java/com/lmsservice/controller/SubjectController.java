package com.lmsservice.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.response.ApiResponse;
import com.lmsservice.dto.response.SubjectResponse;
import com.lmsservice.service.SubjectService;

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
    public ResponseEntity<ApiResponse> createSubject(@Valid @RequestBody CreateSubjectRequest requestDTO) {
        SubjectResponse responseDTO = subjectService.createSubject(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<SubjectResponse>builder()
                        .code(HttpStatus.CREATED.value())
                        .message("Subject created successfully")
                        .result(responseDTO)
                        .build());
    }
}
