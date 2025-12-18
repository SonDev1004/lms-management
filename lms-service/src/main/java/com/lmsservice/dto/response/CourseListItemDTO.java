package com.lmsservice.dto.response;

import lombok.Data;

@Data
public class CourseListItemDTO {
    private Long courseId;
    private String title;
    private String code;

    private String teacherName;
    private String programName;
    private String subjectName;

    private Integer students;
    private Integer capacity;
    private Integer sessions;

    private String startDate;
    private String status;
}
