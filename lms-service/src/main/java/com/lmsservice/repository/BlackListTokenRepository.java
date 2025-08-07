package com.lmsservice.repository;

import java.time.Instant;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.BlackListToken;

@Repository
public interface BlackListTokenRepository extends JpaRepository<BlackListToken, String> {
    boolean existsByTokenHash(String tokenHash);

    @Transactional // Todo: Nhân kiểm tra lại @Transactional để làm gì, nó có thật sự cần thiết không?
    @Modifying
    int deleteByExpiresAtBefore(Instant expiry);
}
