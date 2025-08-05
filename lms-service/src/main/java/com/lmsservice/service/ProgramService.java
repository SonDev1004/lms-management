package com.lmsservice.service;

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

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
public interface ProgramService {
    public ProgramResponse createProgram(ProgramRequest programRequest);

}
