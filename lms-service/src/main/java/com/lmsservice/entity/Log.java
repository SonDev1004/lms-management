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
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Log extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(255)")
    String actionType;

    @Column(columnDefinition = "nvarchar(255)")
    String description;

    @Column(columnDefinition = "nvarchar(255)")
    String relatedTable;

    Integer relatedId;

    @Column(columnDefinition = "nvarchar(255)")
    String relatedOldData;

    @Column(columnDefinition = "nvarchar(255)")
    String relatedNewData;

    LocalDateTime actionDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;
}
