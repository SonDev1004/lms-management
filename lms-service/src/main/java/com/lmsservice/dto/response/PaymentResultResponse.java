package com.lmsservice.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentResultResponse extends  CreatePaymentResponse{
    String status; // SUCCESS, FAILED, CANCELLED

}
