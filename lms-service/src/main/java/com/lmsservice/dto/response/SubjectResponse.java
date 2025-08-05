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
public class SubjectResponse {
    Long id;
    String title;
    String code;
    Integer sessionNumber;
    BigDecimal fee;
    String image;
    Integer minStudent;
    Integer maxStudent;
    String description;
    Boolean isActive;
}
