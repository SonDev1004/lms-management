package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {}
