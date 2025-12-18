package com.lmsservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LatestEnrollmentItemResponse {
    Long id;

    Long studentId;
    String studentName;
    String email;
    String phone;

    Long programId;
    String programTitle;

    Long subjectId;      // hoặc courseId nếu bạn dùng course
    String subjectTitle; // hoặc courseTitle

    BigDecimal paidFee;
    BigDecimal remainingFee;

    String payStatus;      // PAID / PARTIAL / UNPAID / REFUNDED
    String payMethod;      // CASH / VNPAY / BANK_TRANSFER / ...

    LocalDateTime lastPaymentAt; // thời điểm payment mới nhất (nếu có)
}
