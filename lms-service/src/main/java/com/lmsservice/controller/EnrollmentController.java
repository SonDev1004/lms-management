package com.lmsservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.request.EnrollmentRequestDTO;
import com.lmsservice.dto.response.EnrollmentResponseDTO;
import com.lmsservice.service.EnrollmentService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/enrollment")
public class EnrollmentController {
    EnrollmentService enrollmentService;

    /// API đăng kí Program và Subject
    @PostMapping("/register-program-subject")
    public ResponseEntity<EnrollmentResponseDTO> registerProgramAndSubject(@RequestBody EnrollmentRequestDTO request) {

        EnrollmentResponseDTO responseDTO = enrollmentService.registerEnrollment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
}
