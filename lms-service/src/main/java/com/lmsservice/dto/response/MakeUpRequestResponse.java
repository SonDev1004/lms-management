package com.lmsservice.dto.response;

import com.lmsservice.dto.request.MakeUpRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MakeUpRequestResponse {
    Long id;
    Long studentId;
    String studentName;
    Long courseId;
    String courseName;
    Long sessionId;
    String sessionTitle;
    LocalDateTime sessionDateTime;
    String reason;
    MakeUpRequestStatus status;
    String adminNote;
    LocalDateTime createdAt;
    LocalDateTime processedAt;
}
