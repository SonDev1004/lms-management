package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
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
public class Program extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(100)", nullable = false)
    String title;

    @Column(columnDefinition = "decimal(18,2) default 0.00", nullable = false)
    Double fee;

    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    @Column(columnDefinition = "tinyint default 1",nullable = false)
    Integer minStudent;

    @Column(columnDefinition = "tinyint  default 1",nullable = false)
    Integer maxStudent;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    @Column(columnDefinition = "bit default 1", nullable = false)
    Boolean isActive;
    //Curriculum
    @OneToMany(mappedBy = "program")
    List<Curriculum> curriculumList;
    //Enrollments
    @OneToMany(mappedBy = "program")
    List<Enrollment> enrollments;
}
