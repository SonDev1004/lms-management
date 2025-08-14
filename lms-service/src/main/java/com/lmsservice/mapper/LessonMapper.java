package com.lmsservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import com.lmsservice.dto.request.LessonRequest;
import com.lmsservice.dto.response.LessonResponse;
import com.lmsservice.entity.Lesson;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    LessonMapper INSTANCE = Mappers.getMapper(LessonMapper.class);

    // DTO -> Entity
    Lesson toEntity(LessonRequest request);

    // Entity -> DTO
    @Mapping(source = "subject.id", target = "subjectId")
    LessonResponse toResponse(Lesson lesson);
}
