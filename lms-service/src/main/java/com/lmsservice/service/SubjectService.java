package com.lmsservice.service;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.response.SubjectResponse;

@Service
public interface SubjectService {
    SubjectResponse createSubject(CreateSubjectRequest requestDTO);
}
