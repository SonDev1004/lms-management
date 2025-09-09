package com.lmsservice.entity;

import java.time.LocalDate;
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

    @Column(name = "status", columnDefinition = "int default 0", nullable = false)
    Integer status; // 0=PENDING, 1=ONGOING, 2=FINISHED

    LocalDate startDate;
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
    @JoinColumn(name = "teacher_id")
    Teacher teacher;

    // Staff
    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;
    // CourseStudents
    @OneToMany(mappedBy = "course")
    List<CourseStudent> courseStudents;

    /**
     * Pattern lịch học hằng tuần (T2/T4/T6...), sinh từ bảng course_timeslot
     */
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CourseTimeslot> timeslots = new ArrayList<>();
}
