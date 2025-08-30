package com.lmsservice.security;

import com.lmsservice.entity.User;

import java.util.Optional;

public interface CurrentUserService {

    Long requireUserId();

    Optional<Long> getUserId();

    Long requireStudentId();

    Optional<Long> getStudentId();

    String getUsername();

    // ✨ mới:
    CustomUserDetails requireUserDetails();

    User requireUserEntity(boolean reloadFromDb);


}
