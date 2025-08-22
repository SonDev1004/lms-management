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

    @Column(name = "code", columnDefinition = "char(36)", nullable = false)
    String code;

    @Column(columnDefinition = "int default 1")
    Integer capacity;
    /**
     * Số buổi dự kiến (thường mặc định bằng subject.session_number)
     */
    @Column(name = "planned_session")
    Integer plannedSession;
    // Subject
    @ManyToOne
    @JoinColumn(name = "subject_id")
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

    /** Pattern lịch học hằng tuần (T2/T4/T6...), sinh từ bảng course_timeslot */
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CourseTimeslot> timeslots = new ArrayList<>();
}
