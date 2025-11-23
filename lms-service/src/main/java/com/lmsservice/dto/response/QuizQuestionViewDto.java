package com.lmsservice.dto.response;

import com.lmsservice.dto.request.CreateMcqQuestionRequest;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class QuizQuestionViewDto {
    private Long questionId;
    private Short orderNumber;
    private BigDecimal points;

    private Integer type;
    private String content;
    private String audioUrl;

    private List<CreateMcqQuestionRequest.OptionDto> options; // tái dùng OptionDto
}


