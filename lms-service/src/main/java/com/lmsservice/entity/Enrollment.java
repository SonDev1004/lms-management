package com.lmsservice.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Enrollment extends EntityAbstract {
    @Column(columnDefinition = "decimal(18,2) default 0.00", nullable = false)
    BigDecimal paidFee;

    @Column(columnDefinition = "decimal(18,2) default 0.00", nullable = false)
    BigDecimal remainingFee;

    // Student
    @ManyToOne()
    @JoinColumn(name = "studentId", nullable = false)
    Student student;
    //Staff
    @ManyToOne()
    @JoinColumn(name = "staffId", nullable = false)
    Staff staff;
    // Program
    @ManyToOne()
    @JoinColumn(name = "programId", nullable = false)
    Program program;
    // Subject
    @ManyToOne()
    @JoinColumn(name = "subjectId", nullable = false)
    Subject subject;

    @OneToMany(mappedBy = "enrollment")
    List<PaymentHistory> paymentHistories;
}
