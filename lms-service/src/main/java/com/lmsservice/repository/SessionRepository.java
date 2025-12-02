package com.lmsservice.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>, JpaSpecificationExecutor<Session> {
    long countByCourseIdAndDateLessThanEqual(Long courseId, LocalDate date);

    List<Session> findByCourseIdAndDate(Long courseId, LocalDate date);

    List<Session> findByCourseIdOrderByOrderSessionAsc(Long courseId);

    @Query("""
        select s from Session s
        join s.course c
        where c.teacher.id = :teacherId
          and s.date between :from and :to
        order by s.date, s.startTime
    """)
    List<Session> findForTeacherBetween(
            @Param("teacherId") Long teacherId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    @Query("""
        select s from Session s
        join s.course c
        join com.lmsservice.entity.CourseStudent cs
             on cs.course = c
        where cs.student.id = :studentId
          and s.date between :from and :to
        order by s.date, s.startTime
    """)
    List<Session> findForStudentBetween(
            @Param("studentId") Long studentId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}
