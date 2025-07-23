package com.lmsservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
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
    @Column(columnDefinition = "nvarchar(100)")
    String title;

    @Column(columnDefinition = "decimal(18,2)")
    Double fee;

    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    @Column(columnDefinition = "tinyint default 1")
    Integer minStudent;

    @Column(columnDefinition = "tinyint  default 1")
    Integer maxStudent;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    @Column(columnDefinition = "bit default 1", nullable = false)
    Boolean isActive;
    //Curriculum
    @OneToMany(mappedBy = "program")
    List<Curriculum> curriculumList = new ArrayList<>();
    //Enrollments
    @OneToMany(mappedBy = "program")
    List<Enrollment> enrollments;
}
