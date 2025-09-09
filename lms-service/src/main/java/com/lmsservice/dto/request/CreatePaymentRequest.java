package com.lmsservice.dto.request;

import java.math.BigDecimal;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreatePaymentRequest {
    Long programId;
    Long subjectId;
    BigDecimal amount;
}
