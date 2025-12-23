package com.lmsservice.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

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

    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    @Column(columnDefinition = "nvarchar(max)")
    String note;

    @Column(columnDefinition = "bit default 0", nullable = false)
    boolean isFullTime;

    // Courses
    @OneToMany(mappedBy = "teacher")
    @JsonIgnore
    List<Course> courses;
    // User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    User user;
}
