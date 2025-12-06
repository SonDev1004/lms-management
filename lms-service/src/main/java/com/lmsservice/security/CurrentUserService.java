package com.lmsservice.security;

import java.util.Optional;

import com.lmsservice.entity.User;

public interface CurrentUserService {

    Long requireUserId();

    Optional<Long> getUserId();

    Long requireStudentId();

    Optional<Long> getStudentId();

    Optional<Long> getTeacherId();

    Long requireTeacherId();

    String getUsername();

    CustomUserDetails requireUserDetails();

    User requireUserEntity(boolean reloadFromDb);

    User getCurrentUser();
}
