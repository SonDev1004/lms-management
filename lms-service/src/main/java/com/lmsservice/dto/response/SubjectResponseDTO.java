package com.lmsservice.dto.response;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponseDTO {
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
