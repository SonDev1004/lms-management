package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.CourseStudent;

@Repository
public interface CourseStudentRepository extends JpaRepository<CourseStudent, Long> {
    boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);

    List<CourseStudent> findByCourseId(Long courseId);
}
