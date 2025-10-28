package com.lmsservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String content;

    @Column(columnDefinition = "tinyint CHECK (severity >= 1 AND severity <= 5)", nullable = false)
    Short severity;

    @Column(columnDefinition = "nvarchar(max)")
    String url;

    @Column(columnDefinition = "bit default 0", nullable = false)
    boolean isSeen;

    LocalDateTime postedDate;

    // Notification
    @ManyToOne
    @JoinColumn(name = "notification_type_id", nullable = false)
    NotificationType notificationType;

    // User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;
}
