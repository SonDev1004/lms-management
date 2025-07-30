package com.lmsservice.dto.response;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponseDTO {
    private Long enrollmentId;
    private Long studentId;
    private Long staffId;
    private Long programId;
    private Long subjectId;
    private BigDecimal paidFee;
    private BigDecimal remainingFee;
}
