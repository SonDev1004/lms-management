package com.lmsservice.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    String title;

    @Min(value = 1, message = "Minimum student must be at least 1")
    Integer minStudent;

    @Min(value = 1, message = "Maximum student must be at least {value}")
    Integer maxStudent;

    @Min(value = 0, message = "Fee must be non-negative")
    BigDecimal fee;

    String description;
    Boolean isActive = true;
}
