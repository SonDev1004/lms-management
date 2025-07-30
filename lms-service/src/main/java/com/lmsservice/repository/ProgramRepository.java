package com.lmsservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    // Method to find all active programs
    // where isActive = true
    Page<Program> findByIsActiveTrue(Pageable pageable);
}