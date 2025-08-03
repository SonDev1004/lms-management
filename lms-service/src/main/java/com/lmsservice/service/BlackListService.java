package com.lmsservice.service;

import java.time.LocalDateTime;

public interface BlackListService {
    void addToBlackList(String token);

    boolean isTokenBlacklisted(String token);
    ;

}
