package com.lmsservice.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.BlackListToken;

@Repository
public interface BlackListTokenRepository extends JpaRepository<BlackListToken, Long> {
    boolean existsByToken(String token);
}
