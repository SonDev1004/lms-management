package com.lmsservice.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.ProgramRequest;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.entity.Program;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.service.ProgramService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgramServiceImpl implements ProgramService {
    ProgramRepository programRepository;

    public ProgramResponse createProgram(ProgramRequest programRequest) {

        // validate the request
        if (programRequest.getMinStudent() != null && programRequest.getMinStudent() < 1) {
            throw new AppException(ErrorCode.INVALID_MIN_STUDENT);
        }

        if (programRequest.getMaxStudent() != null && programRequest.getMaxStudent() < 1) {
            throw new AppException(ErrorCode.INVALID_MAX_STUDENT);
        }
        if (programRequest.getMinStudent() != null
                && programRequest.getMaxStudent() != null
                && programRequest.getMinStudent() > programRequest.getMaxStudent()) {
            throw new AppException(ErrorCode.INVALID_PROGRAM_RANGE);
        }
        if (programRepository.existsByTitle(programRequest.getTitle())) {
            throw new AppException(ErrorCode.DUPLICATE_PROGRAM_TITLE);
        }

        Program program = new Program();
        program.setCode(generatePrettyUUID());
        program.setTitle(programRequest.getTitle());
        program.setMinStudent(programRequest.getMinStudent() != null ? programRequest.getMinStudent() : 1);
        program.setMaxStudent(programRequest.getMaxStudent() != null ? programRequest.getMaxStudent() : 1);
        program.setFee(programRequest.getFee() != null ? programRequest.getFee() : BigDecimal.ZERO);
        program.setIsActive(programRequest.getIsActive() != null ? programRequest.getIsActive() : true);

        Program savedProgram = programRepository.save(program);
        return ProgramResponse.builder()
                .id(savedProgram.getId())
                .title(savedProgram.getTitle())
                .code(savedProgram.getCode())
                .minStudent(savedProgram.getMinStudent())
                .maxStudent(savedProgram.getMaxStudent())
                .fee(savedProgram.getFee())
                .description(savedProgram.getDescription())
                .isActive(savedProgram.getIsActive())
                .build();
    }

    // Generate a unique code for the program
    private String generatePrettyUUID() {
        String date = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String shortUUID = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "PROG-" + date + "-" + shortUUID;
    }
}
