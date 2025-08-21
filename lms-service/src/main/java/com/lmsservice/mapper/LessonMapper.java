package com.lmsservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;
import com.lmsservice.entity.Lesson;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    // DTO -> Entity
    Lesson toEntity(LessonRequest request);

    // Entity -> DTO
    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.title", target = "subjectTitle")
    LessonResponse toResponse(Lesson lesson);
}
