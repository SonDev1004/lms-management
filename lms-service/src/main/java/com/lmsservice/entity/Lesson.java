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
public class Lesson extends EntityAbstract {
    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String title;

    @Column(columnDefinition = "nvarchar(max)", nullable = false)
    String content;

    @Column(columnDefinition = "nvarchar(max)")
    String description;

    @Column(columnDefinition = "nvarchar(max)")
    String document;

    @ManyToOne()
    @JoinColumn(name = "subjectId", nullable = false)
    Subject subject;
}
