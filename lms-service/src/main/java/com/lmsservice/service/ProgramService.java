package com.lmsservice.service;

import java.util.List;

import com.lmsservice.dto.response.OptionDto;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CurriculumRequest;
import com.lmsservice.dto.request.program.ProgramFilterRequest;
import com.lmsservice.dto.request.program.ProgramRequest;
import com.lmsservice.dto.response.CurriculumResponse;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.dto.response.program.ProgramDetailResponse;

@Service
public interface ProgramService {
    ProgramResponse createProgram(ProgramRequest programRequest);

    List<CurriculumResponse> addSubjectsToProgram(Long programId, List<CurriculumRequest> requests);

    PageResponse<ProgramResponse> getAllPrograms(ProgramFilterRequest f, Pageable pageable);

    ProgramDetailResponse getProgramDetail(Long programId, boolean onlyUpcoming);

    List<OptionDto> getSubjectsByProgram(Long programId);

    void updateProgram(Long id, ProgramRequest request);

    void deleteProgram(Long id);
}
