package com.lmsservice.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;
import com.lmsservice.entity.Lesson;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.mapper.LessonMapper;
import com.lmsservice.repository.LessonRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.security.CustomUserDetails;
import com.lmsservice.service.LessonService;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class LessonServiceImpl implements LessonService {
    LessonRepository lessonRepository;
    SubjectRepository subjectRepository;
    LessonMapper lessonMapper;

    @Override
    public LessonResponse createLesson(LessonRequest lessonRequest) {
        Subject subject = subjectRepository
                .findById(lessonRequest.getSubjectId())
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.SUBJECT_NOT_FOUND));

        Lesson lesson = lessonMapper.toEntity(lessonRequest);
        lesson.setSubject(subject);

        Lesson savedLesson = lessonRepository.save(lesson);
        return lessonMapper.toResponse(savedLesson);
    }

    @Override
    public Page<LessonResponse> getAllLessons(int page, int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long userId = userDetails.getUser().getId();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        Pageable pageable = PageRequest.of(page, size);

        if (role.equals("ROLE_ADMIN_IT") || role.equals("ROLE_ACADEMIC_MANAGER")) {
            return lessonRepository.findAll(pageable).map(this::toLessonResponse);

        } else if (role.equals("ROLE_TEACHER")) {
            return lessonRepository.findBySubject_Teacher_Id(userId, pageable).map(this::toLessonResponse);

        } else if (role.equals("ROLE_STUDENT")) {
            return lessonRepository
                    .findBySubject_Enrollments_Student_Id(userId, pageable)
                    .map(this::toLessonResponse);
        }
        throw new UnAuthorizeException(ErrorCode.UNAUTHORIZED_ACCESS_ROLE);
    }

    private LessonResponse toLessonResponse(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .content(lesson.getContent())
                .description(lesson.getDescription())
                .document(lesson.getDocument())
                .subjectId(lesson.getSubject().getId())
                .build();
    }
}
