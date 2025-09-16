package com.lmsservice.service.impl;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CreateSubjectRequest;
import com.lmsservice.dto.request.subject.SubjectFilterRequest;
import com.lmsservice.dto.response.subject.SubjectDetailResponse;
import com.lmsservice.dto.response.subject.SubjectResponse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.policy.SubjectPolicy;
import com.lmsservice.service.SubjectService;
import com.lmsservice.spec.SubjectSpecifications;
import com.lmsservice.util.CourseStatus;
import com.lmsservice.util.ScheduleFormatter;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;

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

    @Override
    public SubjectDetailResponse getDetail(Long id, boolean onlyUpcoming) {

        var s = subjectRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUBJECT_NOT_FOUND));

        List<Course> courses = courseRepository.findBySubject_IdOrderByStatusDescStartDateAscIdAsc(s.getId());

        if (onlyUpcoming) {
            LocalDate today = LocalDate.now();
            courses = courses.stream()
                    .filter(c -> c.getStartDate() == null || !c.getStartDate().isBefore(today))
                    .toList();
        }
        courses = courses.stream()
                .filter(c -> VISIBLE.contains(c.getStatus()))
                .sorted(
                        Comparator
                                .comparing((Course c) -> c.getStatus().getCode(), Comparator.reverseOrder())
                                .thenComparing(Course::getStartDate, Comparator.nullsLast(Comparator.naturalOrder()))
                                .thenComparing(Course::getId)
                )
                .toList();

        // Map Course -> DTO
        var classItems = courses.stream()
                .map(c -> {
                    var activeSlots = Optional.ofNullable(c.getTimeslots())
                            .orElseGet(List::of).stream()
                            .filter(ts -> Boolean.TRUE.equals(ts.getIsActive()))
                            .toList();
                    String schedule = ScheduleFormatter.format(activeSlots);

                    CourseStatus statusEnum = c.getStatus();
                    Integer status = (statusEnum != null ? statusEnum.getCode() : null);
                    String statusName = (statusEnum == null) ? "Khác" : switch (statusEnum) {
                        case DRAFT, SCHEDULED -> "Sắp khai giảng";
                        case ENROLLING, WAITLIST -> "Đang tuyển sinh";
                        case IN_PROGRESS -> "Đang học";
                        case COMPLETED -> "Đã học";
                    };

                    return SubjectDetailResponse.CourseItem.builder()
                            .courseId(c.getId())
                            .courseTitle(c.getTitle())
                            .courseCode(c.getCode())
                            .plannedSessions(c.getPlannedSession())
                            .capacity(c.getCapacity())
                            .startDate(c.getStartDate())
                            .status(status)
                            .statusName(statusName)
                            .schedule(schedule)
                            .build();
                })
                .toList();

        return SubjectDetailResponse.builder()
                .id(s.getId())
                .codeSubject(s.getCode())
                .subjectTitle(s.getTitle())
                .subjectDescription(s.getDescription())
                .sessionNumber(s.getSessionNumber())
                .fee(s.getFee())
                .imgUrl(s.getImage()) // tùy entity
                .maxStudents(s.getMaxStudent())
                .minStudents(s.getMinStudent())
                .isActive(Boolean.TRUE.equals(s.getIsActive()))
                .classes(classItems)
                .build();
    }
    private static final java.util.EnumSet<CourseStatus> VISIBLE =
            java.util.EnumSet.of(CourseStatus.SCHEDULED, CourseStatus.ENROLLING, CourseStatus.WAITLIST);
    private static final List<String> SUBJECT_SORTABLE =
            List.of("title", "code", "fee", "sessionNumber", "status", "id");

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
