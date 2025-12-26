package com.lmsservice.dto.response;

import com.lmsservice.util.MakeUpRequestStatus;
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

    Long sessionId;                // missed session id
    String sessionTitle;
    LocalDateTime sessionDateTime;

    String reason;
    MakeUpRequestStatus status;
    String adminNote;

    LocalDateTime createdAt;
    LocalDateTime processedAt;

    // ===== NEW (V25) =====
    Long preferredSessionId;

    Long approvedSessionId;
    Long approvedCourseId;
    String approvedCourseName;
    LocalDateTime approvedSessionDateTime;

    LocalDateTime scheduledAt;
    LocalDateTime attendedAt;
}
