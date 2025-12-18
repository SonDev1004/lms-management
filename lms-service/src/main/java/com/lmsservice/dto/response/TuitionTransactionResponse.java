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
public class TuitionTransactionResponse {
    Long id;

    LocalDateTime date;

    String student;       // tên học viên
    String code;          // mã học viên

    String program;       // tên program
    String subject;       // tên subject / course

    BigDecimal amount;    // số tiền giao dịch
    String method;        // Cash / Credit Card / Bank Transfer...
    String bank;          // TCB / BIDV / ...
    String tranNo;        // mã giao dịch
    String status;        // Success / Failed
    String orderInfo;     // nội dung order
}
