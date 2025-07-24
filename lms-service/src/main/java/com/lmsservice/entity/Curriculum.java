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
public class Curriculum extends EntityAbstract {
    @Column(name = "[order]", columnDefinition = "tinyint default 1", nullable = false)
    Integer orderNumber;

    @ManyToOne()
    @JoinColumn(name = "program_id", nullable = false)
    Program program;

    @ManyToOne()
    @JoinColumn(name = "subject_id", nullable = false)
    Subject subject;
}
