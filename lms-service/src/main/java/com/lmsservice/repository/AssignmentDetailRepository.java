package com.lmsservice.repository;

import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.AssignmentDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentDetailRepository extends JpaRepository<AssignmentDetail, Long> {

    List<AssignmentDetail> findByAssignmentOrderByOrderNumberAsc(Assignment assignment);

    List<AssignmentDetail> findByAssignmentIdOrderByOrderNumberAsc(Long assignmentId);

    void deleteByAssignmentId(Long assignmentId);

}
