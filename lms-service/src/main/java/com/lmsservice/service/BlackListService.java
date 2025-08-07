package com.lmsservice.service;

import java.time.Instant;

public interface BlackListService {
    void addToBlackList(String token, Instant expirationTime);

    boolean isTokenBlacklisted(String token);
}
