package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Curriculum;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Long> {
    boolean existsByProgramIdAndSubjectId(Long subjectId, Long programId);

    boolean existsByProgramIdAndOrderNumber(Long programId, Integer orderNumber);

    List<Curriculum> findByProgramId(Long programId);

    @Query("SELECT MAX(c.orderNumber) FROM Curriculum c WHERE c.program.id = :programId")
    Integer findMaxOrderNumberByProgramId(Long programId);
}
