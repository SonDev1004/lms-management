package com.lmsservice.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentRequestDTO {
    private Long studentId;
    private Long staffId;
    private Long programId;
    private Long subjectId;
    private BigDecimal paidFee;
}
