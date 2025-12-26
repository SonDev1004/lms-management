package com.lmsservice.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

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

    List<Session> findByCourse_IdOrderByDateAscStartTimeAsc(Long courseId);

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

    @Query("""

            select s
        from Session s
            join fetch s.course c
            left join fetch c.teacher t
            left join fetch t.user u
            left join fetch s.room r
        where s.date between :from and :to
        """)
    List<Session> findAllBetween(
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    void deleteByCourseId(Long courseId);

    int countByCourseId(Long courseId);

    @Query(value = """
        select case when count_big(s.id) > 0 then 1 else 0 end
        from [session] s
        join course c on c.id = s.course_id
        where c.teacher_id = :teacherId
          and s.[date] = :date
          and (s.start_time < cast(:endTime as time)
               and s.end_time   > cast(:startTime as time))
        """, nativeQuery = true)
    int existsTeacherConflictRaw(@Param("teacherId") Long teacherId,
                                 @Param("date") LocalDate date,
                                 @Param("startTime") LocalTime startTime,
                                 @Param("endTime") LocalTime endTime);

    default boolean existsTeacherConflict(Long teacherId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return existsTeacherConflictRaw(teacherId, date, startTime, endTime) == 1;
    }

    @Query("""
    select s.date
    from Session s
    where s.course.id = :courseId
      and s.orderSession = :order
""")
    Optional<LocalDate> findDateByCourseIdAndOrderSession(
            @Param("courseId") Long courseId,
            @Param("order") short order
    );


    @Query("""
    select max(s.date)
    from Session s
    where s.course.id = :courseId
""")
    Optional<LocalDate> findMaxDateByCourseId(@Param("courseId") Long courseId);

    @Query(value = """
        select case when count_big(s.id) > 0 then 1 else 0 end
        from [session] s
        where s.room_id = :roomId
          and s.[date] = :date
          and (s.start_time < cast(:endTime as time)
               and s.end_time   > cast(:startTime as time))
        """, nativeQuery = true)
    int existsRoomConflictRaw(@Param("roomId") Long roomId,
                              @Param("date") LocalDate date,
                              @Param("startTime") LocalTime startTime,
                              @Param("endTime") LocalTime endTime);

    default boolean existsRoomConflict(Long roomId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        return existsRoomConflictRaw(roomId, date, startTime, endTime) == 1;
    }
    }
