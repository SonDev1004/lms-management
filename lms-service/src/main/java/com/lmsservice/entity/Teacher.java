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
public class Teacher extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)")
    String certificate;

    @Column(columnDefinition = "nvarchar(max)")
    String specialty;

    @Column(columnDefinition = "char(36)")
    String code;

    @Column(columnDefinition = "nvarchar(max)")
    String note;

    @Column(columnDefinition = "bit default 0")
    boolean isFullTime;

    //Courses
    @OneToMany(mappedBy = "teacher")
    List<Course> courses;
    //User
    @OneToOne
    @JoinColumn(name = "userId", nullable = false, unique = true)
    User user;
}
