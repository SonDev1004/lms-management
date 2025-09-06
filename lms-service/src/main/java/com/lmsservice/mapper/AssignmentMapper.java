package com.lmsservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.entity.Assignment;

@Mapper(componentModel = "spring")
public interface AssignmentMapper {

    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "course.title", target = "courseTitle")
    @Mapping(source = "active", target = "isActive")
    AssignmentResponse toResponse(Assignment assignment);
}
