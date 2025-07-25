package com.lmsservice.entity;

import java.math.BigDecimal;
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
public class Enrollment extends EntityAbstract {
    @Column(columnDefinition = "decimal(18,2) default 0.00", nullable = false)
    BigDecimal paidFee;

    @Column(columnDefinition = "decimal(18,2) default 0.00", nullable = false)
    BigDecimal remainingFee;

    // Student
    @ManyToOne()
    @JoinColumn(name = "student_id", nullable = false)
    Student student;
    // Staff
    @ManyToOne()
    @JoinColumn(name = "staff_id", nullable = false)
    Staff staff;
    // Program
    @ManyToOne()
    @JoinColumn(name = "program_id")
    Program program;
    // Subject
    @ManyToOne()
    @JoinColumn(name = "subject_id")
    Subject subject;

    @OneToMany(mappedBy = "enrollment")
    List<PaymentHistory> paymentHistories;
}
