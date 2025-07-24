package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
}
