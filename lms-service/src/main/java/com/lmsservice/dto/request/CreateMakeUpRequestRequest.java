package com.lmsservice.dto.request;

import lombok.Data;

@Data
public class CreateMakeUpRequestRequest {
    Long sessionId;
    String reason;
}
