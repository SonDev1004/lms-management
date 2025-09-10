package com.lmsservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.PaymentHistory;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    Optional<PaymentHistory> findTopByReferenceNumberOrderByIdDesc(String referenceNumber);
}
