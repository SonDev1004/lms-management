package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMakeUpRequestRequest {

    @NotNull
    private Long sessionId; // missedSessionId (buổi vắng)

    @NotBlank
    private String reason;

    // OPTIONAL: student chọn luôn session học bù
    private Long makeupSessionId;
}
