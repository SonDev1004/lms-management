package com.lmsservice.dto.request;

import jakarta.validation.constraints.*;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreatePaymentRequest {
    @NotNull(message = "Program ID is required")
    Long programId;

    @NotNull(message = "Subject ID is required")
    Long subjectId;
}
