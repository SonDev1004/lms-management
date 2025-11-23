package com.lmsservice.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Assignment extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String title;

    @Column(columnDefinition = "tinyint default 10")
    String maxScore;

    @Column(columnDefinition = "nvarchar(max)")
    String fileName;

    Integer factor;

    LocalDateTime dueDate;

    public enum AssignmentType {QUIZ, UPLOAD, HOMEWORK, EXAM}

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_type", columnDefinition = "nvarchar(max)", nullable = false)
    AssignmentType assignmentType;

    @Column(columnDefinition = "bit default 1", nullable = false)
    boolean isActive;

    // Course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    // Submissions
    @OneToMany(mappedBy = "assignment")
    List<Submission> submissions;
}
