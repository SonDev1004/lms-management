package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    List<Course> findBySubject_IdOrderByStatusDescStartDateAscIdAsc(Long subjectId);

    List<Course> findByProgram_Id(Long programId);
}