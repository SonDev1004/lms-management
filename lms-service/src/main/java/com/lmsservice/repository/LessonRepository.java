package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySubjectId(Long subjectId);

    Page<Lesson> findBySubject_Teacher_Id(Long teacherId, Pageable pageable);

    Page<Lesson> findBySubject_Enrollments_Student_Id(Long studentId, Pageable pageable);
}
