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
public class Log extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(255)")
    String actionType;

    @Column(columnDefinition = "nvarchar(255)")
    String description;

    @Column(columnDefinition = "nvarchar(255)")
    String relatedTable;

    Integer relatedId;

    @Column(columnDefinition = "nvarchar(255)")
    String relatedOlData;

    @Column(columnDefinition = "nvarchar(255)")
    String relatedNewData;

    LocalDateTime actionDate;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    User user;
}
