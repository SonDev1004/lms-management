package com.lmsservice.dto.response;

import com.lmsservice.entity.Assignment;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AssignmentScoreItemDto {
    private Long assignmentId;
    private String title;
    private Assignment.AssignmentType assignmentType;
    private Integer factor;
    private BigDecimal maxScore;
    private BigDecimal latestScore;
}
