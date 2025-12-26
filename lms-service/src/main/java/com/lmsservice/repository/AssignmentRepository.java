package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByCourseId(Long courseId);

    List<Assignment> findByCourseIdAndIsActiveTrue(Long courseId);

    long countByCourse_IdAndAssignmentType(
            Long courseId,
            Assignment.AssignmentType assignmentType
    );

    boolean existsByCourse_IdAndAssignmentType(
            Long courseId,
            Assignment.AssignmentType assignmentType
    );
    boolean existsByIdAndSubmissionsIsNotEmpty(Long assignmentId);
//    boolean existsByAssignment_Id(Long assignmentId);

}