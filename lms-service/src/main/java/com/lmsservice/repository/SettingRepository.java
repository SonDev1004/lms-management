package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Setting;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {}
