package com.lmsservice.service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.subject.SubjectFilterRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.response.subject.SubjectResponse;


@Service
public interface SubjectService {
    SubjectResponse createSubject(CreateSubjectRequest requestDTO);

    PageResponse<SubjectResponse> getAllSubjects(SubjectFilterRequest f, Pageable pageable);
}
