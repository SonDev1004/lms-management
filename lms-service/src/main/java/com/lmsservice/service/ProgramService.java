package com.lmsservice.service;



import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.ProgramResponseDTO;
import com.lmsservice.repository.ProgramRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgramService {

    ProgramRepository programRepository;

    public Page<ProgramResponseDTO> getAllPrograms(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        return programRepository.findByIsActiveTrue(pageable)
                .map(program -> ProgramResponseDTO.builder()
                        .title(program.getTitle())
                        .fee(program.getFee())
                        .code(program.getCode())
                        .minStudent(program.getMinStudent())
                        .maxStudent(program.getMaxStudent())
                        .description(program.getDescription())
                        .isActive(program.getIsActive())
                        .build()
                );
    }
}

