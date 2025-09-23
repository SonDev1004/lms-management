package com.lmsservice.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>, JpaSpecificationExecutor<Session> {
    long countByCourseIdAndDateLessThanEqual(Long courseId, LocalDate date);

    List<Session> findByCourseIdAndDate(Long courseId, LocalDate date);

    List<Session> findByCourseIdOrderByOrderSessionAsc(Long courseId);
}
