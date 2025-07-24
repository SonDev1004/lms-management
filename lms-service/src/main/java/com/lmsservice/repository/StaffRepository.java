package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {}
