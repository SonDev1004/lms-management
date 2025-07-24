package com.lmsservice.service;

import org.springframework.stereotype.Service;

import com.lmsservice.repository.EnrollmentRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentService {
    EnrollmentRepository enrollmentRepository;
}
