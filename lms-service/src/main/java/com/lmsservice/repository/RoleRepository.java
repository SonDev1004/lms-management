package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {}
