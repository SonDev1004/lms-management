package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.BlackListToken;

import java.time.Instant;

@Repository
public interface BlackListTokenRepository extends JpaRepository<BlackListToken, String> {
    boolean existsByTokenHash(String tokenHash);
    int deleteByExpiresAtBefore(Instant expiry);

}
