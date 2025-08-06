package com.lmsservice.security;

import java.time.Instant;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.lmsservice.repository.BlackListTokenRepository;

@Component
public class TokenCleanupTask {

    private final BlackListTokenRepository blacklistTokenRepository;

    public TokenCleanupTask(BlackListTokenRepository blacklistTokenRepository) {
        this.blacklistTokenRepository = blacklistTokenRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // mỗi giờ chạy 1 lần
    //    @Scheduled(fixedRate = 10000) // mỗi 10 giây
    public void cleanBlackListTokens() {
        Instant now = Instant.now();
        int deleted = blacklistTokenRepository.deleteByExpiresAtBefore(now);
        System.out.println("Đã xóa " + deleted + " token hết hạn khỏi blacklist.");
    }
}
