package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResultResponse {
    String txnRef;
    String status;      // PENDING / SUCCESS / FAILED / CANCELLED / EXPIRED
    BigDecimal amount;
    BigDecimal totalFee;
    Long programId;
    String programName;
    Long subjectId;
    String subjectName;
    Long enrollmentId;  // null nếu chưa thành công
    String message;

    Long userId;
    String orderInfo;
    String currency;
}

