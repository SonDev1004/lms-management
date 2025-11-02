package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long>, JpaSpecificationExecutor<Program> {
    boolean existsByTitle(String title);

    @Query(
            """
				SELECT p FROM Program p
				WHERE (:kw IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%',:kw,'%')))
				ORDER BY p.id DESC
			""")
    List<Program> searchPrograms(@Param("kw") String kw);
}
