package com.lmsservice.repository;

import com.lmsservice.util.MakeUpRequestStatus;
import com.lmsservice.entity.MakeUpRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MakeUpRequestRepository extends JpaRepository<MakeUpRequest, Long> {

    Page<MakeUpRequest> findByStatus(MakeUpRequestStatus status, Pageable pageable);

    Page<MakeUpRequest> findByStatusAndCourse_Id(MakeUpRequestStatus status, Long courseId, Pageable pageable);

    boolean existsByStudent_IdAndSession_Id(Long studentUserId, Long missedSessionId);

    Page<MakeUpRequest> findByStudent_Id(Long studentUserId, Pageable pageable);

    Page<MakeUpRequest> findByStudent_IdAndStatus(Long studentUserId, MakeUpRequestStatus status, Pageable pageable);

    Page<MakeUpRequest> findByStudent_IdAndCourse_Id(Long studentUserId, Long courseId, Pageable pageable);

    Page<MakeUpRequest> findByStudent_IdAndStatusAndCourse_Id(Long studentUserId, MakeUpRequestStatus status, Long courseId, Pageable pageable);
}
