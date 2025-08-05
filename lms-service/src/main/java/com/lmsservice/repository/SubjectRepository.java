package com.lmsservice.repository;

import jakarta.validation.constraints.NotBlank;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByTitle(@NotBlank(message = "Title is required") String title);
}
