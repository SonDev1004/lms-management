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
public class Submission extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String fileName;

    @Column(columnDefinition = "float default 0.00", nullable = false)
    Float score;

    LocalDateTime submittedDate;

    // Assignment
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    Assignment assignment;

    // Student
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    Student student;
}
