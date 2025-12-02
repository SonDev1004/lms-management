package com.lmsservice.repository;

import com.lmsservice.dto.request.MakeUpRequestStatus;
import com.lmsservice.entity.MakeUpRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MakeUpRequestRepository extends JpaRepository<MakeUpRequest, Long> {

    Page<MakeUpRequest> findByStatus(MakeUpRequestStatus status, Pageable pageable);

    Page<MakeUpRequest> findByStatusAndCourse_Id(MakeUpRequestStatus status, Long courseId, Pageable pageable);
}
