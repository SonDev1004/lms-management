package com.lmsservice.dto.request;

import lombok.Data;

import java.util.Map;

/**
 * answers: key = questionId (String), value = đáp án của HS
 * V1 (MCQ_SINGLE): value = String (key option) ví dụ "A", "B"
 * Sau này có thể cho MULTI => List<String>
 */
@Data
public class SubmitQuizRequest {
    private Long submissionId;
    private Map<String, Object> answers; // questionId -> answer
}
