package com.lmsservice.service.impl;

import org.springframework.stereotype.Service;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;
import com.lmsservice.entity.Lesson;
import com.lmsservice.entity.Subject;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.LessonRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.service.LessonService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {
    final LessonRepository lessonRepository;
    final SubjectRepository subjectRepository;

    @Override
    public LessonResponse createLesson(LessonRequest lessonRequest) {
        Subject subject = subjectRepository
                .findById(lessonRequest.getSubjectId())
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.SUBJECT_NOT_FOUND));
        Lesson lesson = new Lesson();

        lesson.setTitle(lessonRequest.getTitle());
        lesson.setContent(lessonRequest.getContent());
        lesson.setDescription(lessonRequest.getDescription());
        lesson.setDocument(lessonRequest.getDocument());
        lesson.setSubject(subject);

        Lesson savedLesson = lessonRepository.save(lesson);
        return LessonResponse.builder()
                .id(savedLesson.getId())
                .title(savedLesson.getTitle())
                .content(savedLesson.getContent())
                .description(savedLesson.getDescription())
                .document(savedLesson.getDocument())
                .subjectId(savedLesson.getSubject().getId())
                .build();
    }


    @Override
    public List<LessonResponse> getAllLessons() {
        return lessonRepository.findAll().stream()
                        .map(lesson -> LessonResponse.builder()
                                .id(lesson.getId())
                                .title(lesson.getTitle())
                                .content(lesson.getContent())
                                .description(lesson.getDescription())
                                .document(lesson.getDocument())
                                .subjectId(lesson.getSubject().getId())
                                .build())
                        .toList();
    }
}
