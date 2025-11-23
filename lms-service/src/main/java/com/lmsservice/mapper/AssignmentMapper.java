package com.lmsservice.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.lmsservice.dto.response.AssignmentResponse;
import com.lmsservice.entity.Assignment;

@Mapper(componentModel = "spring")
public interface AssignmentMapper {
    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "course.title", target = "courseTitle")
    @Mapping(source = "active", target = "status")
    @Mapping(
            target = "assignmentType",
            expression = "java(assignment.getAssignmentType() != null ? java.util.Collections.singletonList(assignment.getAssignmentType().name()) : null)"
    )
    AssignmentResponse toResponse(Assignment assignment);
}
