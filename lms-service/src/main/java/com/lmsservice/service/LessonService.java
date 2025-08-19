package com.lmsservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;

public interface LessonService {
    LessonResponse createLesson(LessonRequest lessonRequest);

    Page<LessonResponse> getLessonsBySubjectId(Long subjectId, Pageable pageable);
}
