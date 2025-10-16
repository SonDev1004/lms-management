package com.lmsservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;

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
}