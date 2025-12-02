package com.lmsservice.entity;

import java.math.BigDecimal;
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
    BigDecimal score;

    LocalDateTime submittedDate;

    // Assignment
    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    Assignment assignment;

    // Student
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    Student student;

    @Column(name = "answers_json", columnDefinition = "nvarchar(max)")
    String answersJson;

    @Column(name = "auto_score", precision = 5, scale = 2)
    BigDecimal autoScore;

    // 0=chưa chấm, 1=auto_done, 2=teacher_reviewed
    @Column(name = "graded_status")
    Integer gradedStatus;

    @Column(name = "started_at")
    LocalDateTime startedAt;

    @Column(name = "finished_at")
    LocalDateTime finishedAt;
}
