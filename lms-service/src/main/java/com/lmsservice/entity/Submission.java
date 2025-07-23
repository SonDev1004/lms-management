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
public class Submission extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)")
    String fileName;

    Integer score;

    LocalDateTime submittedDate;

    //Assignment
    @ManyToOne
    @JoinColumn(name = "assignmentId", nullable = false)
    Assignment assignment;

    //Student
    @ManyToOne
    @JoinColumn(name = "StudentId", nullable = false)
    Student student;
}
