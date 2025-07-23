package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Student extends EntityAbstract {
    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    @Column(columnDefinition = "nvarchar(255)")
    String level;

    @Column(columnDefinition = "nvarchar(max)")
    String note;

    @OneToMany(mappedBy = "student")
    List<Feedback> feedbacks;

    //Submissions
    @OneToMany (mappedBy = "student")
    List<Submission> submissions;

    //CourseStudents
    @OneToMany(mappedBy = "student")
    List<CourseStudent> courseStudents;

    //StudentResults
    @OneToMany(mappedBy = "student")
    List<StudentResult> studentResults;

    //Enrollments
    @OneToMany(mappedBy = "student")
    List<Enrollment> enrollments;

    //User
    @OneToOne
    @JoinColumn(name = "userId", nullable = false, unique = true)
    User user;
}
