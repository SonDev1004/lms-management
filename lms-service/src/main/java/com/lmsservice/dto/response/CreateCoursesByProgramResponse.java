package com.lmsservice.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class CreateCoursesByProgramResponse {
    private String trackCode;
    private List<Long> createdCourseIds;
}

