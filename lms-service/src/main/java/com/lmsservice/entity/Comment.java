package com.lmsservice.entity;

import java.time.LocalDateTime;
import java.util.Date;

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
public class Comment extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(255)", nullable = false)
    String content;

    Date postedDate;

    @Column(columnDefinition = "bit default 0", nullable = false)
    LocalDateTime isAppropriate;

    @ManyToOne()
    @JoinColumn(name = "session_id")
    Session session;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    User user;
}
