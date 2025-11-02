package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OptionStringDto {
    String value; // code chuỗi, ví dụ "STUDENT"
    String label; // hiển thị
}
