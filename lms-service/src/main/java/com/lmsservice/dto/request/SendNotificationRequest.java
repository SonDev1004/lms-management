package com.lmsservice.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class SendNotificationRequest {
    private String title;
    private String content;
    private int severity;
    private String url;
    private Long notificationTypeId;
    private LocalDateTime scheduledDate;

    private List<String> targetRoles;
    private List<Long> targetUserIds;
    private List<Long> targetCourseIds;
    private List<Long> targetProgramIds;
    private Boolean broadcast;
}
