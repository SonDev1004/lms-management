package com.lmsservice.service.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

import jakarta.transaction.Transactional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.common.paging.PageableUtils;
import com.lmsservice.dto.request.CurriculumRequest;
import com.lmsservice.dto.request.program.ProgramFilterRequest;
import com.lmsservice.dto.request.program.ProgramRequest;
import com.lmsservice.dto.response.CurriculumResponse;
import com.lmsservice.dto.response.ProgramResponse;
import com.lmsservice.entity.Curriculum;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CurriculumRepository;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.policy.ProgramPolicy;
import com.lmsservice.service.ProgramService;
import com.lmsservice.spec.ProgramSpecifications;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgramServiceImpl implements ProgramService {
    ProgramRepository programRepository;
    CurriculumRepository curriculumRepository;
    SubjectRepository subjectRepository;
    ProgramPolicy programPolicy;

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
        program.setImageUrl(
                programRequest.getImageUrl() != null ? programRequest.getImageUrl() : ""
        );

        Program savedProgram = programRepository.save(program);
        return ProgramResponse.builder()
                .id(savedProgram.getId())
                .title(savedProgram.getTitle())
                .code(savedProgram.getCode())
                .minStudent(savedProgram.getMinStudent())
                .maxStudent(savedProgram.getMaxStudent())
                .fee(savedProgram.getFee())
                .description(savedProgram.getDescription())
                .imageUrl(savedProgram.getImageUrl())
                .isActive(savedProgram.getIsActive())
                .build();
    }

    @Override
    @Transactional
    public List<CurriculumResponse> addSubjectsToProgram(Long programId, List<CurriculumRequest> requests) {

        if (requests == null || requests.isEmpty()) {
            throw new AppException(ErrorCode.EMPTY_SUBJECT_LIST);
        }

        Program program =
                programRepository.findById(programId).orElseThrow(() -> new AppException(ErrorCode.PROGRAM_NOT_FOUND));
        if (program.getIsActive() == false) {
            throw new AppException(ErrorCode.PROGRAM_NOT_ACTIVE);
        }
        Set<Long> subjectIds = new HashSet<>();
        for (CurriculumRequest req : requests) {
            if (!subjectIds.add(req.getSubjectId())) {
                throw new AppException(ErrorCode.DUPLICATE_SUBJECT_IN_REQUEST);
            }
        }

        List<Curriculum> curriculumList = new ArrayList<>();
        Integer currentMaxOrder = curriculumRepository.findMaxOrderNumberByProgramId(programId);
        int nextOrder = (currentMaxOrder == null ? 1 : currentMaxOrder + 1);

        for (CurriculumRequest req : requests) {
            Subject subject = subjectRepository
                    .findById(req.getSubjectId())
                    .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));
            if (subject.getIsActive() == false) {
                throw new AppException(ErrorCode.SUBJECT_NOT_ACTIVE);
            }

            Curriculum curriculum = new Curriculum();
            curriculum.setProgram(program);
            curriculum.setSubject(subject);
            curriculum.setOrderNumber(nextOrder++);

            curriculumList.add(curriculum);
        }
        List<Curriculum> savedCurriculums;
        try {
            savedCurriculums = curriculumRepository.saveAll(curriculumList);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.SUBJECT_ALREADY_IN_PROGRAM);
        }

        return savedCurriculums.stream()
                .map(c -> CurriculumResponse.builder()
                        .id(c.getId())
                        .order(c.getOrderNumber())
                        .programId(c.getProgram().getId())
                        .subjectId(c.getSubject().getId())
                        .build())
                .toList();
    }

    @Override
    public PageResponse<ProgramResponse> getAllPrograms(ProgramFilterRequest f, Pageable pageable) {

        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean canViewAll = programPolicy.canViewAll(auth);

        log.info(
                "getAllPrograms canViewAll={} authorities={}",
                canViewAll,
                auth != null ? auth.getAuthorities() : "null");

        // ✅ chỉ cần gọi 1 hàm from(f, canViewAll)
        Specification<Program> spec = ProgramSpecifications.from(f, canViewAll);

        // Cho phép sort theo các field ROOT của Program
        Set<String> whitelist = PageableUtils.toWhitelist(
                "id", "title", "fee", "code", "minStudent", "maxStudent", "isActive", "createdAt", "updatedAt");
        Sort fallback = Sort.by(Sort.Order.desc("id")); // sort mặc định khi client không truyền/hoặc truyền sai
        Pageable safe = PageableUtils.sanitizeSort(pageable, whitelist, fallback);

        Page<Program> page = programRepository.findAll(spec, safe);
        // map sang DTO
        Page<ProgramResponse> dtoPage = page.map(p -> ProgramResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .fee(p.getFee())
                .code(p.getCode())
                .minStudent(p.getMinStudent())
                .maxStudent(p.getMaxStudent())
                .description(p.getDescription())
                .isActive(p.getIsActive())
                .build());
        return PageResponse.from(dtoPage);
    }

    // Generate a unique code for the program
    private String generatePrettyUUID() {
        String date = new SimpleDateFormat("yyyyMMdd").format(new Date());
        String shortUUID = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "PROG-" + date + "-" + shortUUID;
    }
}
