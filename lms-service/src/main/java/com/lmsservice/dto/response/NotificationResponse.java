package com.lmsservice.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String content;
    private int severity;
    private boolean isSeen;
    private String url;
    private String type;

    private LocalDateTime postedDate;

    private LocalDateTime scheduledDate;

    private Long receiverUserId;
    private String receiverName;
    private String receiverRole;
}
