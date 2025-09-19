package com.lmsservice.service.impl;

import org.springframework.stereotype.Service;

import com.lmsservice.service.EnrollmentService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class EnrollmentServiceImpl implements EnrollmentService {}
