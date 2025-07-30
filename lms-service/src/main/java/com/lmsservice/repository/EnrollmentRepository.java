package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /// Kiêm tra xem Student đã đăng ký chương trình nào chưa
    boolean existsByStudentIdAndProgramId(Long studentId, Long programId);

    /// Kiểm tra xem Student đã đăng ký Subject nào chưa
    @Query("SELECT COUNT(e) > 0 FROM Enrollment e " + "WHERE e.student.id = :studentId AND e.subject.id IN :subjectIds")
    boolean existsByStudentAndSubjectInProgram(Long studentId, List<Long> subjectIds);

    /// Kiểm tra xem Student đã đăng ký Subject nào chưa
    boolean existsByStudentIdAndSubjectId (Long studentId, Long subjectId);
}
