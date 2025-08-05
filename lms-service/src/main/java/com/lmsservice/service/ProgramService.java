package com.lmsservice.service;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.ProgramResponse;

@Service
public interface ProgramService {
    ProgramResponse createProgram(ProgramRequest programRequest);
}
