package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveMakeUpRequestRequest {
    // AM có thể duyệt theo session student đã chọn, hoặc chọn session khác
    @NotNull
    private Long makeupSessionId;

    private String adminNote;
}
