package com.lmsservice.entity;

import java.time.LocalDate;
import java.time.LocalTime;
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
public class Session extends EntityAbstract {

    @Column(name = "[order]", columnDefinition = "tinyint default 1", nullable = false)
    Short orderSession;

    LocalDate date;

    LocalTime startTime;

    LocalTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timeslot_id")
    private CourseTimeslot timeslot;

    @Column(name = "status")
    Integer status; // 1=Planned, 2=Completed, 5=Cancelled

    @Column(columnDefinition = "nvarchar(max)")
    String fileNames;

    @Column(columnDefinition = "bit default 0", nullable = false)
    boolean isAbsent;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    // Course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    Course course;

    // Comments
    @OneToMany(mappedBy = "session")
    List<Comment> comments = new ArrayList<>();

    // Room
    @ManyToOne()
    @JoinColumn(name = "room_id")
    Room room;
}
