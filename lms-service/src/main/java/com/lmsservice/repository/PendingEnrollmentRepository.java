package com.lmsservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lmsservice.entity.PendingEnrollment;

public interface PendingEnrollmentRepository extends JpaRepository<PendingEnrollment, Long> {
    Optional<PendingEnrollment> findByTxnRef(String txnRef);
}
