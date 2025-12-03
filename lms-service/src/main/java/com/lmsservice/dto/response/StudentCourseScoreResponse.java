package com.lmsservice.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class StudentCourseScoreResponse {
    private Long courseId;
    private String courseTitle;

    private Float averageScore;   // từ CourseStudent.averageScore
    private Integer status;       // 0/1/2...
    private String statusText;    // "IN_PROGRESS" / "PASS" / "FAIL"

    private Float passThreshold;

    private List<AssignmentScoreItemDto> assignments;
}
