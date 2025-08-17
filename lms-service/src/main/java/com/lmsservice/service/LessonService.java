package com.lmsservice.service;

import java.util.List;

import org.springframework.data.domain.Pageable;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;

public interface LessonService {
    LessonResponse createLesson(LessonRequest lessonRequest);

    List<LessonResponse> getLessonsBySubjectId(Long subjectId, Pageable pageable);
}
