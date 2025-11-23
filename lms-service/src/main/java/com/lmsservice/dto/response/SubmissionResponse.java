package com.lmsservice.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SubmissionResponse {
    private Long submissionId;
    private Long assignmentId;
    private BigDecimal score;        // điểm cuối cùng
    private BigDecimal maxScore;     // điểm tối đa của bài
    private Integer percentage;      // score/maxScore * 100 (làm tròn)
    private String status;           // IN_PROGRESS / SUBMITTED / GRADED / ABORTED ...
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
}
