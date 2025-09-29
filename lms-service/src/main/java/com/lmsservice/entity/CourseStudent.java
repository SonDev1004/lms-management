package com.lmsservice.entity;

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
public class CourseStudent extends EntityAbstract {
    Float averageScore;

    @Column(nullable = false)
    Integer status;

    @Column(columnDefinition = "varchar(max) default '[]'", nullable = false)
    String attendanceList;

    @Column(columnDefinition = "bit default 0", nullable = false)
    Boolean isAudit;

    @Column(columnDefinition = "nvarchar(max)")
    String note;

    // Student
    @ManyToOne()
    @JoinColumn(name = "student_id", nullable = false)
    Student student;

    // Course
    @ManyToOne()
    @JoinColumn(name = "course_id", nullable = false)
    Course course;
}
