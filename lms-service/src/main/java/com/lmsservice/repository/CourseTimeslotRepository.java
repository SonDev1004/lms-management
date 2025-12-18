package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.CourseTimeslot;

import java.util.List;

@Repository
public interface CourseTimeslotRepository
        extends JpaRepository<CourseTimeslot, Long>, JpaSpecificationExecutor<CourseTimeslot> {
    List<CourseTimeslot> findByCourseIdAndIsActiveTrue(Long courseId);

    List<CourseTimeslot> findByCourseIdOrderByDayOfWeekAscStartTimeAsc(Long courseId);

    void deleteByCourseId(Long courseId);
}
