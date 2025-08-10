package com.lmsservice.service;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;

import java.util.List;

public interface LessonService {
    LessonResponse createLesson(LessonRequest lessonRequest);
//        List<LessonResponse> getLessonsBySubjectId(Long subjectId);
        List<LessonResponse> getAllLessons();

}
