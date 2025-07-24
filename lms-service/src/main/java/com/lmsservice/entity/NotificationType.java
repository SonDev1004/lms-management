package com.lmsservice.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationType extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    String title;

    @Column(columnDefinition = "nvarchar(255)")
    String icon;

    @OneToMany(mappedBy = "notificationType")
    List<Notification> notifications;
}
