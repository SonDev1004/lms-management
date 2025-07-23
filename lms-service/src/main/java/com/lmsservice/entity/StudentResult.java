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
public class StudentResult extends EntityAbstract {
    @Column(columnDefinition = "float default 0.00", nullable = false)
    Float score;

    //Student
    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    Student student;

    //Subject
    @ManyToOne
    @JoinColumn(name = "subjectId", nullable = false)
    Subject subject;
}
