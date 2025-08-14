package com.lmsservice.dto.request.program;

import java.math.BigDecimal;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramFilterRequest {
    // lọc bằng LIKE (không phân biệt hoa thường)
    private String title;
    private String code;

    // khoảng học phí
    private BigDecimal feeMin;
    private BigDecimal feeMax;

    // trạng thái
    private Boolean isActive;

    // search nhiều field (title/description/code)
    private String keyword;
}
