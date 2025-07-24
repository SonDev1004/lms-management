package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Log;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {}
