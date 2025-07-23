package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationType extends EntityAbstract{
    @Column(columnDefinition = "nvarchar(255)")
    String title;
    @Column(columnDefinition = "nvarchar(255)")
    String icon;

    @OneToMany(mappedBy = "notificationType")
    List<Notification> notifications;
}
