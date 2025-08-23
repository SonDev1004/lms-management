package com.lmsservice.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Page<LessonResponse> getLessonsBySubjectId(Long subjectId, Pageable pageable) {
        Subject subject = subjectRepository
                .findById(subjectId)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.SUBJECT_NOT_FOUND));

        Page<Lesson> lessonsPage = lessonRepository.findBySubjectId(subject.getId(), pageable);

        List<LessonResponse> lessonResponses =
                lessonsPage.getContent().stream().map(lessonMapper::toResponse).collect(Collectors.toList());

        return new PageImpl<>(lessonResponses, pageable, lessonsPage.getTotalElements());
    }

    @Override
    public Page<LessonResponse> getAllLessons(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonRepository.findAll(pageable);
        return lessons.map(lessonMapper::toResponse);
    }
}
