package com.lmsservice.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.response.ProgramResponseDTO;
import com.lmsservice.service.ProgramService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/program")
public class ProgramController {
    ProgramService programService;

    // Endpoint to get all active programs having isActive = true
    @GetMapping("/all-programs")
    public Page<ProgramResponseDTO> getAllPrograms(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   @RequestParam(defaultValue = "id") String sortBy) {

        return programService.getAllPrograms(page, size, sortBy);
    }
}
