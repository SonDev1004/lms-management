package com.lmsservice.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaymentResponse {
    // Core payment fields
    String paymentUrl; // VNPAY URL
    String txnRef; // từ PendingEnrollment.txnRef
    Long id; // PendingEnrollment.id
    String status; // PENDING, SUCCESS, etc.

    // Amount info
    BigDecimal totalFee;
    BigDecimal amount;

    @Builder.Default
    String currency = "VND";

    // Timing info
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime expiresAt;

    Integer timeoutSeconds;

    // User & Course info
    Long userId;

    // Chỉ giữ tên thôi
    String programName;
    String subjectName;

    String orderInfo;

    @Builder.Default
    String locale = "vn";
}
