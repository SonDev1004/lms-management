package com.lmsservice.dto.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class HandleAssignmentRetakeRequest {
    private boolean approve;
    private String adminNote;
    private LocalDateTime retakeDeadline;
}
