package com.lmsservice.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AvailableMakeUpSessionResponse {
    private Long sessionId;
    private Long courseId;
    private String courseName;

    private Integer orderSession;
    private LocalDateTime sessionDateTime;

    private String roomName;
    private String teacherName;
}