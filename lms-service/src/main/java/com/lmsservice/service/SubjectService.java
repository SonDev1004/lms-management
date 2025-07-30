package com.lmsservice.service;

import java.util.List;

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

    public List<SubjectResponseDTO> getAllSubject() {
        return subjectRepository.findAllByIsActiveTrue().stream()
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
                        .build())
                .toList();
    }
}
