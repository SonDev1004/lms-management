package com.lmsservice.dto.request;

import lombok.Data;

@Data
public class AddStudentToCourseRequest {
    private Long courseId;
    private Long studentId;
    private String source;
}
