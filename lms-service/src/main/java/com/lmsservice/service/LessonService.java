package com.lmsservice.service;

import org.springframework.data.domain.Page;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;

public interface LessonService {
    LessonResponse createLesson(LessonRequest lessonRequest);
    //        List<LessonResponse> getLessonsBySubjectId(Long subjectId);
    Page<LessonResponse> getAllLessons(int page, int size);
}
