package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Session extends  EntityAbstract {

    @Column(name = "[order]", columnDefinition = "tinyint")
    Short orderSession; // Đôi thành sessionOrder

    LocalDate date;

    LocalTime startTime;

    LocalTime endTime;

    @Column(columnDefinition = "nvarchar(max)")
    String fileNames;

    @Column(columnDefinition = "bit default 0")
    boolean isAbsent;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    //Course
    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    Course course;

    //Comments
    @OneToMany(mappedBy = "session")
    List<Comment> comments = new ArrayList<>();

    //Room
    @ManyToOne()
    @JoinColumn(name = "roomId", nullable = false)
    Room room;
}
