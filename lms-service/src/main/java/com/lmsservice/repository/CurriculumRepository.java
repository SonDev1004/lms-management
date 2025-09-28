package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Curriculum;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Long> {
    // tồn tại cặp (program, subject) ?
    boolean existsByProgram_IdAndSubject_Id(Long programId, Long subjectId);

    // tồn tại orderNumber trong 1 program ?
    boolean existsByProgram_IdAndOrderNumber(Long programId, Integer orderNumber);

    // lấy list curriculum theo program, có sắp xếp
    List<Curriculum> findByProgram_IdOrderByOrderNumberAsc(Long programId);

    // nếu cần list không sắp xếp:
    List<Curriculum> findByProgram_Id(Long programId);

    @Query("select max(c.orderNumber) from Curriculum c where c.program.id = :programId")
    Integer findMaxOrderNumberByProgramId(Long programId);
}
