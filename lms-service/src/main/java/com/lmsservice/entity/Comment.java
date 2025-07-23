package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;

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
    @JoinColumn(name = "sessionId")
    Session session;

    @ManyToOne()
    @JoinColumn(name = "userId")
    User user;
}
