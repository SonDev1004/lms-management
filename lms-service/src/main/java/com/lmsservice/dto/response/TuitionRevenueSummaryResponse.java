package com.lmsservice.dto.response;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TuitionRevenueSummaryResponse {

    Integer year;
    Integer month;

    long transactions;      // tổng số giao dịch
    long successCount;      // số giao dịch thành công
    long failedCount;       // số giao dịch failed / refund

    BigDecimal totalCollected; // tổng tiền các giao dịch Success
    BigDecimal refundAmount;   // tổng tiền các giao dịch Failed/Refund
    BigDecimal avgTicket;      // totalCollected / successCount (0 nếu chia cho 0)
}
