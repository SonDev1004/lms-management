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
    @Column(name = "[order]", columnDefinition = "tinyint")
    Integer orderNumber;

    @ManyToOne()
    @JoinColumn(name = "programId", nullable = false)
    Program program;

    @ManyToOne()
    @JoinColumn(name = "subjectId", nullable = false)
    Subject subject;
}
