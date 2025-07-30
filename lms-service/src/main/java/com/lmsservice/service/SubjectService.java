package com.lmsservice.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.response.SubjectResponseDTO;
import com.lmsservice.repository.SubjectRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SubjectService {
    SubjectRepository subjectRepository;

    public Page<SubjectResponseDTO> getAllSubject(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return subjectRepository.findAllByIsActiveTrue(pageable)
                .map(subject -> SubjectResponseDTO.builder()
                        .title(subject.getTitle())
                        .code(subject.getCode())
                        .sessionNumber(subject.getSessionNumber())
                        .fee(subject.getFee())
                        .image(subject.getImage())
                        .minStudent(subject.getMinStudent())
                        .maxStudent(subject.getMaxStudent())
                        .description(subject.getDescription())
                        .isActive(subject.getIsActive())
                        .build());

    }
}
