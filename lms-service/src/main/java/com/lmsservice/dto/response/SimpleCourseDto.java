package com.lmsservice.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class SimpleCourseDto {
    Long id;
    String code;
    String title;
}
