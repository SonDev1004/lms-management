package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AttendanceRecordDTO {
    Integer status; // 0: Vắng, 1: Có mặt, 2: Đi trễ
    String note; // Ghi chú của buổi này
}
