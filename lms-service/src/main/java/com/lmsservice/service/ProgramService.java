package com.lmsservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.CurriculumRequest;
import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.CurriculumResponse;
import com.lmsservice.dto.response.ProgramResponse;

@Service
public interface ProgramService {
    ProgramResponse createProgram(ProgramRequest programRequest);

    List<CurriculumResponse> addSubjectsToProgram(Long programId, List<CurriculumRequest> requests);
}
