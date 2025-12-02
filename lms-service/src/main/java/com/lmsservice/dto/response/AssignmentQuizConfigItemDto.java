package com.lmsservice.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AssignmentQuizConfigItemDto {
    private Long assignmentDetailId;
    private Long questionId;
    private Short orderNumber;
    private BigDecimal points;
    private String questionContentPreview;
}
