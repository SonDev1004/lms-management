package com.lmsservice.repository;

import com.lmsservice.entity.AssignmentRetakeRequest;
import com.lmsservice.util.AssignmentRetakeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRetakeRequestRepository
        extends JpaRepository<AssignmentRetakeRequest, Long> {

    Optional<AssignmentRetakeRequest> findFirstByStudent_IdAndAssignment_IdAndStatusIn(
            Long studentId,
            Long assignmentId,
            Collection<AssignmentRetakeStatus> statuses
    );

    List<AssignmentRetakeRequest> findByAssignment_Id(Long assignmentId);
}

