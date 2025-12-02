package com.lmsservice.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class AssignmentRequest {
    private Long id;
    private Long courseId;
    private Long sessionId;       // có thể null
    private String title;
    private Integer maxScore;
    private String fileName;
    private Double factor;
    private LocalDateTime dueDate;
    private Boolean isActive;
    private List<String> assignmentType; // [QUIZ_PHASE, MID_TEST, FINAL_TEST]
}
