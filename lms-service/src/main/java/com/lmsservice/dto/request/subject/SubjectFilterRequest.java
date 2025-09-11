package com.lmsservice.dto.request.subject;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectFilterRequest {
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
