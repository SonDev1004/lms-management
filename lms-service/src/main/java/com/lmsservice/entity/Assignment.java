package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Assignment extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)")
    String title;

    @Column(columnDefinition = "tinyint default 10")
    String maxScore;

    @Column(columnDefinition = "nvarchar(max)")
    String fileName;

    Integer factor;

    LocalDateTime dueDate;
    @Column(columnDefinition = "bit default 1")
    boolean isActive;

    //Course
    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    Course course;

    //Submissions
    @OneToMany(mappedBy = "assignment")
    List<Submission> submissions;
}
