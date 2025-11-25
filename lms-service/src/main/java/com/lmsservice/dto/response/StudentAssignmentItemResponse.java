package com.lmsservice.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class StudentAssignmentItemResponse {
    private Long id;                  // assignmentId
    private String title;
    private LocalDateTime dueDate;
    private String assignmentType;    // QUIZ_PHASE / MID_TEST / FINAL_TEST
    private String maxScore;

    // ==== THÊM CHO STUDENT ====
    private String studentStatus;     // NOT_SUBMITTED / SUBMITTED / GRADED
    private BigDecimal studentScore;  // điểm bài này (nếu đã chấm)
}
