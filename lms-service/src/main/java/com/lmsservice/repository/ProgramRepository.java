package com.lmsservice.repository;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    boolean existsByTitle(
            @NotBlank(message = "Title is required")
                    @Size(max = 100, message = "Title must be less than 100 characters")
                    String title);
}
