package com.lmsservice.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AssignmentQuestionConfig {
    private Long questionId;      // question_bank.id
    private Short orderNumber;    // thứ tự câu (1,2,3,4...)
    private BigDecimal points;    // điểm của câu
}
