package com.lmsservice.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class SendNotificationRequest {
    private String title;
    private String content;
    private int severity;
    private String url;
    private Long notificationTypeId;

    private List<String> targetRoles;
    private List<Long> targetUserIds;
    private List<Long> targetCourseIds;
    private List<Long> targetProgramIds;
    private Boolean broadcast;
}
