package com.lmsservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

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
    Integer quantity;

    // Subject
    @ManyToOne
    @JoinColumn(name = "subjectId", nullable = false)
    Subject subject;
    //Assignments
    @OneToMany(mappedBy = "course")
    List<Assignment> assignments = new ArrayList<>();
    // Sessions
    @OneToMany(mappedBy = "course")
    List<Session> sessions = new ArrayList<>();

    @OneToMany(mappedBy = "course")
    List<Feedback> feedbacks = new ArrayList<>();

    //Teacher
    @ManyToOne
    @JoinColumn(name = "teacherId", nullable = false)
    Teacher teacher;

    //Staff
    @ManyToOne
    @JoinColumn(name = "staffId", nullable = false)
    Staff staff;
    // CourseStudents
    @OneToMany(mappedBy = "course")
    List<CourseStudent> courseStudents;
}
