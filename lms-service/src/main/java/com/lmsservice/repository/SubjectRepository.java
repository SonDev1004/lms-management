package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Page<Subject> findAllByIsActiveTrue(Pageable pageable);
}
