package com.lmsservice.repository;

import com.lmsservice.entity.PendingEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PendingEnrollmentRepository extends JpaRepository<PendingEnrollment, Long> {
    Optional<PendingEnrollment> findByTxnRef(String txnRef);
}