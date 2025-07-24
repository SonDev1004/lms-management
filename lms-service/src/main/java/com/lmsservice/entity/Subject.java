package com.lmsservice.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Subject extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)", nullable = false)
    String title;

    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    @Column(columnDefinition = "tinyint default 1", nullable = false)
    Integer sessionNumber;

    @Column(columnDefinition = "decimal(18,2) default 0.00", nullable = false)
    BigDecimal fee;

    @Column(columnDefinition = "nvarchar(max)")
    String image;

    @Column(columnDefinition = "tinyint default 1", nullable = false)
    Integer minStudent;

    @Column(columnDefinition = "tinyint default 1", nullable = false)
    Integer maxStudent;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    @Column(columnDefinition = "bit default 1", nullable = false)
    Boolean isActive;

    // Curriculum
    @OneToMany(mappedBy = "subject")
    List<Curriculum> curriculums = new ArrayList<>();

    // Courses
    @OneToMany(mappedBy = "subject")
    List<Course> courses = new ArrayList<>();

    // Lessons
    @OneToMany(mappedBy = "subject")
    List<Lesson> lessons = new ArrayList<>();

    // StudentResults
    @OneToMany(mappedBy = "subject")
    List<StudentResult> studentResults;
    // Enrollments
    @OneToMany(mappedBy = "subject")
    List<Enrollment> enrollments;
}
