package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseStudent extends EntityAbstract {
    Float averageScore;
    @Column(columnDefinition = "varchar(max)")
    String attendanceList;

    @Column(columnDefinition = "bit default 0")
    Boolean isAudit;

    @Column(columnDefinition = "nvarchar(max)")
    String note;

    //Student
    @ManyToOne()
    @JoinColumn(name = "studentId", nullable = false)
    Student student;

    //Course
    @ManyToOne()
    @JoinColumn(name = "courseId", nullable = false)
    Course course;
}
