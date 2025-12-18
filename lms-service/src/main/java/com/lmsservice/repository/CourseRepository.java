package com.lmsservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {

    List<Course> findBySubject_IdOrderByStatusDescStartDateAscIdAsc(Long subjectId);

    List<Course> findByProgram_Id(Long programId);

    @Query(
            """
                    	SELECT c FROM Course c
                    	WHERE (:kw IS NULL OR LOWER(c.code) LIKE LOWER(CONCAT('%',:kw,'%'))
                    		OR LOWER(c.title) LIKE LOWER(CONCAT('%',:kw,'%')))
                    	ORDER BY c.id DESC
                    """)
    List<Course> searchCourses(@Param("kw") String kw);

    @Query("""
            SELECT COUNT(c) 
            FROM Course c 
            WHERE c.teacher.id = :teacherId
            """)
    long countByTeacherId(@Param("teacherId") Long teacherId);

    @Query("""
               select c.trackCode from Course c 
               where c.program.id = :programId 
                 and c.trackCode like concat(:prefix, '%')
            """)
    List<String> findTrackCodesByProgramAndPrefix(@Param("programId") Long programId,
                                                  @Param("prefix") String prefix);

    boolean existsByCode(String code);

    Optional<Course> findByTrackCodeAndCurriculumOrder(String trackCode, Integer curriculumOrder);

    List<Course> findByTrackCodeOrderByCurriculumOrderAsc(String trackCode);

    boolean existsByTrackCode(String trackCode);
}
