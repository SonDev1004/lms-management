package com.lmsservice.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentStudentStatusDto {
    private Long studentId;
    private String studentCode;
    private String fullName;
    private String email;
    private String className;

    private String status;       // NOT_SUBMITTED / IN_PROGRESS / SUBMITTED / GRADED
    private BigDecimal score;    // latestScore nếu graded
    private LocalDateTime submittedAt; // thời điểm nộp gần nhất (nếu có)
}
