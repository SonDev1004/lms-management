package com.lmsservice.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.request.subject.SubjectFilterRequest;
import com.lmsservice.dto.response.subject.SubjectResponse;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.policy.SubjectPolicy;
import com.lmsservice.service.SubjectService;
import com.lmsservice.spec.SubjectSpecifications;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public SubjectResponse createSubject(CreateSubjectRequest requestDTO) {
        // Kiểm tra title
        String normalizedTitle = requestDTO.getTitle().trim().replaceAll("\\s+", " ");
        requestDTO.setTitle(normalizedTitle);

        if (normalizedTitle.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_SUBJECT_TITLE);
        }

        if (subjectRepository.existsByTitle(normalizedTitle)) {
            throw new AppException(ErrorCode.SUBJECT_ALREADY_EXISTS);
        }

        if (normalizedTitle.length() > 100) {
            throw new AppException(ErrorCode.INVALID_SUBJECT_TITLE_LENGTH);
        }
        // Kiểm tra minStudent và maxStudent
        if (requestDTO.getMinStudent() > requestDTO.getMaxStudent()) {
            throw new AppException(ErrorCode.SUBJECT_INVALID_RANGE);
        }
        if (requestDTO.getMinStudent() <= 0 || requestDTO.getMaxStudent() <= 0) {
            throw new AppException(ErrorCode.INVALID_MIN_MAX_STUDENT);
        }
        // Kiểm tra sessionNumber
        if (requestDTO.getSessionNumber() != null && requestDTO.getSessionNumber() > 50) {
            throw new AppException(ErrorCode.INVALID_SESSION_NUMBER);
        }
        // Kiểm tra fee
        if (requestDTO.getFee() != null && requestDTO.getFee().compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException(ErrorCode.INVALID_SUBJECT_FEE);
        }

        // Tạo đối tượng Subject từ requestDTO
        Subject subject = new Subject();
        subject.setTitle(requestDTO.getTitle());
        subject.setCode(generateCode());
        subject.setSessionNumber(requestDTO.getSessionNumber() != null ? requestDTO.getSessionNumber() : 1);
        subject.setMinStudent(requestDTO.getMinStudent());
        subject.setMaxStudent(requestDTO.getMaxStudent());
        subject.setFee(requestDTO.getFee() != null ? requestDTO.getFee() : BigDecimal.ZERO);
        subject.setImage(requestDTO.getImage());
        subject.setDescription(requestDTO.getDescription());
        subject.setIsActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : true);
        Subject savedSubject = subjectRepository.save(subject);
        return SubjectResponse.builder()
                .id(savedSubject.getId())
                .title(savedSubject.getTitle())
                .code(savedSubject.getCode())
                .sessionNumber(savedSubject.getSessionNumber())
                .minStudent(savedSubject.getMinStudent())
                .maxStudent(savedSubject.getMaxStudent())
                .fee(savedSubject.getFee())
                .image(savedSubject.getImage())
                .description(savedSubject.getDescription())
                .isActive(savedSubject.getIsActive())
                .build();
    }

    private final SubjectPolicy subjectPolicy;

    @Override
    public PageResponse<SubjectResponse> getAllSubjects(SubjectFilterRequest f, Pageable pageable) {
        pageable = sanitize(pageable);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean canViewAll = subjectPolicy.canViewAll(auth);

        if (!canViewAll) {
            if (f == null) f = new SubjectFilterRequest();
            f.setIsActive(true);
        }

        var spec = SubjectSpecifications.from(f);
        var page = subjectRepository.findAll(spec, pageable);

        Page<SubjectResponse> dtoPage = page.map(s -> SubjectResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .code(s.getCode())
                .sessionNumber(s.getSessionNumber())
                .fee(s.getFee())
                .image(s.getImage())
                .minStudent(s.getMinStudent())
                .maxStudent(s.getMaxStudent())
                .description(s.getDescription())
                .isActive(s.getIsActive())
                .build());
        return PageResponse.from(dtoPage);
    }

    private static final List<String> SUBJECT_SORTABLE =
            List.of("title", "code", "fee", "sessionNumber", "isActive", "id");

    private Pageable sanitize(Pageable pageable) {
        Sort safeSort = Sort.unsorted();
        if (pageable.getSort().isSorted()) {
            List<Sort.Order> safe = new ArrayList<>();
            for (Sort.Order o : pageable.getSort()) {
                if (SUBJECT_SORTABLE.contains(o.getProperty())) {
                    safe.add(o);
                }
            }
            if (!safe.isEmpty()) safeSort = Sort.by(safe);
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), safeSort);
    }

    private String generateCode() {
        String date = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String shortUUID = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "SUB-" + date + "-" + shortUUID;
    }
}
