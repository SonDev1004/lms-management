package com.lmsservice.entity;

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
public class Staff extends EntityAbstract {
    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    // Course
    @OneToMany(mappedBy = "staff")
    List<Course> courses;
    // Enrollments
    @OneToMany(mappedBy = "staff")
    List<Enrollment> enrollments;

    // User
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    User user;
}
