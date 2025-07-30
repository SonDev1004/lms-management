package com.lmsservice.dto.response;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramResponseDTO {
    private String title;
    private BigDecimal fee;
    private String code;
    private Integer minStudent;
    private Integer maxStudent;
    private String description;
    private Boolean isActive;
}
