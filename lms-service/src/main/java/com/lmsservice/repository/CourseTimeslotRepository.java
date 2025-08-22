package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.CourseTimeslot;

@Repository
public interface CourseTimeslotRepository extends JpaRepository<CourseTimeslot, Long> {}
