package com.lmsservice.dto.response;


import lombok.Data;

import java.util.List;
@Data
public class QuizViewResponse {
    private Long assignmentId;
    private String assignmentTitle;
    private Integer durationMinutes; // nếu Assignment có, không thì để null
    private List<QuizQuestionViewDto> questions;
}
