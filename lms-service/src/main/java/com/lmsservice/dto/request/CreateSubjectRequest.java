package com.lmsservice.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateSubjectRequest {
    @NotBlank(message = "Title is required")
    String title;

    String code;

    @Min(value = 1, message = "Session number must be at least 1")
    Integer sessionNumber;

    @Min(value = 0, message = "Fee must be non-negative")
    BigDecimal fee;

    @Builder.Default
    String image = "";

    @Min(value = 1, message = "Minimum student must be at least 1")
    Integer minStudent;

    @Min(value = 1, message = "Maximum student must be at least 1")
    Integer maxStudent;

    String description;

    @Builder.Default
    Boolean isActive = true;
}
