package com.lmsservice.service;

public interface BlackListService {
    void addToBlackList(String token);

    boolean isTokenBlacklisted(String token);
    ;
}
