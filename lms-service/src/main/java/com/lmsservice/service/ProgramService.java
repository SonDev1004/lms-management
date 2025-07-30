package com.lmsservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.ProgramResponseDTO;
import com.lmsservice.repository.ProgramRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgramService {
    ProgramRepository programRepository;

    public List<ProgramResponseDTO> getAllPrograms() {
        return programRepository.findByIsActiveTrue().stream()
                .map(program -> ProgramResponseDTO.builder()
                        .title(program.getTitle())
                        .fee(program.getFee())
                        .code(program.getCode())
                        .minStudent(program.getMinStudent())
                        .maxStudent(program.getMaxStudent())
                        .description(program.getDescription())
                        .isActive(program.getIsActive())
                        .build())
                .toList();
    }
}
