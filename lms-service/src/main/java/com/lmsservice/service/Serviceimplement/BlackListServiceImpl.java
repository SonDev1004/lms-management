package com.lmsservice.service.Serviceimplement;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmsservice.entity.BlackListToken;
import com.lmsservice.repository.BlackListTokenRepository;
import com.lmsservice.service.BlackListService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlackListServiceImpl implements BlackListService {

    private final BlackListTokenRepository blackListTokenRepository;

    @Override
    @Transactional
    public void addToBlackList(String token, Instant expirationTime) {
        if (token == null) {
            log.warn("Token is null, cannot add to blacklist.");
            return;
        }
        String rawToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        if (blackListTokenRepository.existsByTokenHash(rawToken)) {
            log.info("Token already blacklisted.");
            return;
        }

        BlackListToken blackListToken = BlackListToken.builder()
                .tokenHash(rawToken)
                .expiresAt(
                        expirationTime != null ? expirationTime : Instant.now().plusSeconds(86400))
                .build();

        blackListTokenRepository.save(blackListToken);
        log.info("Token added to blacklist: {}", rawToken);
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        return blackListTokenRepository.existsByTokenHash(token);
    }
}
