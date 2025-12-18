package com.lmsservice.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CreateCoursesByProgramRequest {
    private Long programId;
    private Long staffId;
    private Integer capacity;
    private String baseTitle;
    private LocalDate firstWeekStart;
    private String trackCode;
    private List<Long> subjectIds;
}

