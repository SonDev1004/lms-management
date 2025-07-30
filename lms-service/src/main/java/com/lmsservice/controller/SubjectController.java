package com.lmsservice.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lmsservice.dto.response.SubjectResponseDTO;
import com.lmsservice.service.SubjectService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/subject")
public class SubjectController {
    SubjectService subjectService;

    // ge all subjects have IsActive = true
    @GetMapping("/all-subjects")
    public Page<SubjectResponseDTO> getAllSubject(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @RequestParam(defaultValue = "id") String sortBy) {
        return subjectService.getAllSubject(page, size, sortBy);
    }
}

