package com.lmsservice.entity;

import java.util.ArrayList;
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
public class Course extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String title;

    @Column(columnDefinition = "int default 1")
    Integer capacity;

    // Subject
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    Subject subject;
    // Assignments
    @OneToMany(mappedBy = "course")
    List<Assignment> assignments = new ArrayList<>();
    // Sessions
    @OneToMany(mappedBy = "course")
    List<Session> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "course")
    List<Feedback> feedbacks = new ArrayList<>();

    // Teacher
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    Teacher teacher;

    // Staff
    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;
    // CourseStudents
    @OneToMany(mappedBy = "course")
    List<CourseStudent> courseStudents;
}
