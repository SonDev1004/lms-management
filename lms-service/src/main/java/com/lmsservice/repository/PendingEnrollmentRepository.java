package com.lmsservice.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lmsservice.entity.PendingEnrollment;

public interface PendingEnrollmentRepository extends JpaRepository<PendingEnrollment, Long> {
    Optional<PendingEnrollment> findByTxnRef(String txnRef);

    List<PendingEnrollment> findAllByStatusAndCreatedAtBefore(String status, LocalDateTime time);
}
