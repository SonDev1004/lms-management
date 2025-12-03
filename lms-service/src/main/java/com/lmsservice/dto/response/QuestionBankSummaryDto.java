package com.lmsservice.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QuestionBankSummaryDto {
    private Long id;
    private Long subjectId;
    private String subjectTitle;
    private Integer type;
    private String contentPreview;
    private Integer visibility;
    private Boolean active;
    private Long createdBy;
    private LocalDateTime createdAt;
}
