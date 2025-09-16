package com.lmsservice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PendingEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(length = 100, nullable = false, unique = true)
    String txnRef;

    @Column(nullable = false)
    Long userId;

    Long programId;

    Long subjectId;

    @Column(precision = 18, scale = 2, nullable = false)
    BigDecimal totalFee;

    @Column(precision = 18, scale = 2, nullable = false)
    BigDecimal amount;

    @Column(length = 20, nullable = false)
    String status; // PENDING, SUCCESS, FAILED, CANCELLED

    LocalDateTime createdAt;

    LocalDateTime updatedAt;


    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
