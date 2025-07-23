package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification extends EntityAbstract{
    @Column(columnDefinition = "nvarchar(max)")
    String content;

    @Column(columnDefinition = "tinyint CHECK (severity >= 1 AND severity <= 5)")
    Short severity;

    @Column(columnDefinition = "nvarchar(max)")
    String url;

    @Column(columnDefinition = "bit default 0")
    boolean isSeen;

    LocalDateTime postedDate;

    //Notification
    @ManyToOne
    @JoinColumn(name = "notificationTypeId", nullable = false)
    NotificationType notificationType;

    //User
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    User user;
}
