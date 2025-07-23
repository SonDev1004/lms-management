package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Subject extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)")
    String title;

    @Column(columnDefinition = "char(36)")
    String code;

    @Column(columnDefinition = "tinyint")
    Integer sessionNumber;

    @Column(columnDefinition = "decimal(18,2)")
    BigDecimal fee;

    @Column(columnDefinition = "nvarchar(max)")
    String image;

    @Column(columnDefinition = "tinyint default 1")
    Integer minStudent;

    @Column(columnDefinition = "tinyint default 1")
    Integer maxStudent;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    @Column(columnDefinition = "bit default 1", nullable = false)
    Boolean isActive;

    //Curriculum
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
    //Enrollments
    @OneToMany(mappedBy = "subject")
    List<Enrollment> enrollments;
}
