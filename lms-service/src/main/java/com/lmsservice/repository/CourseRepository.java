package com.lmsservice.repository;

import java.util.List;

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
}
