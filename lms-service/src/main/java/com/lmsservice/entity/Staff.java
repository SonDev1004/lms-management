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
public class Staff extends EntityAbstract {
    @Column(columnDefinition = "char(36)", unique = true)
    String code;

    //Course
    @OneToMany(mappedBy = "staff")
    List<Course> courses;
    //Enrollments
    @OneToMany(mappedBy = "staff")
    List<Enrollment> enrollments;

    //User
    @OneToOne
    @JoinColumn(name = "userId", nullable = false, unique = true)
    User user;
}
