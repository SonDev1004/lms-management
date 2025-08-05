package com.lmsservice.security;


import com.lmsservice.repository.BlackListTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class TokenCleanupTask {

    private final BlackListTokenRepository blacklistTokenRepository;

    public TokenCleanupTask(BlackListTokenRepository blacklistTokenRepository) {
        this.blacklistTokenRepository = blacklistTokenRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // mỗi giờ chạy 1 lần (bạn có thể thay đổi cron)
//    @Scheduled(fixedRate = 10000) // mỗi 10 giây
    public void cleanBlackListTokens() {
        Instant now = Instant.now();
        int deleted = blacklistTokenRepository.deleteByExpiresAtBefore(now);
        System.out.println("Đã xóa " + deleted + " token hết hạn khỏi blacklist.");
    }

}
