package com.lmsservice.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Feedback extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)")
    String content;

    @Column(columnDefinition = "tinyint")
    Short rating;

    // Course
    @ManyToOne()
    @JoinColumn(name = "course_id", nullable = false)
    Course course;
    // Student
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    Student student;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
