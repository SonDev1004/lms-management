package com.lmsservice.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramResponseDTO {
    Long id;
    String title;
    BigDecimal fee;
    String code;
    Integer minStudent;
    Integer maxStudent;
    String description;
    Boolean isActive;
}
