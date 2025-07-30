package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Curriculum;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Long> {
    // Lấy ra danh sách Subjects theo Program ID
    @Query("SELECT c.subject.id FROM Curriculum c WHERE c.program.id = :programId")
    List<Long> findSubjectIdsByProgramId(Long programId);

    @Query("SELECT COUNT(c) > 0 FROM Curriculum c " +
            "WHERE c.subject.id = :subjectId AND c.program.id IN " +
            "(SELECT e.program.id FROM Enrollment e WHERE e.student.id = :studentId AND e.program IS NOT NULL)")
    boolean existsSubjectInStudentPrograms(@Param("studentId") Long studentId, @Param("subjectId") Long subjectId);

}
