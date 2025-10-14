package com.lmsservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    Optional<User> findByUserNameOrEmail(String userName, String email);

    boolean existsByEmail(String email);

    boolean existsByUserName(String userName);

    List<User> findByRole_NameIgnoreCase(String roleName);

    @Query(
            """
		SELECT u FROM User u
		WHERE LOWER(u.userName) LIKE LOWER(CONCAT('%', :kw, '%'))
		OR LOWER(u.email) LIKE LOWER(CONCAT('%', :kw, '%'))
	""")
    List<User> searchUsers(@Param("kw") String keyword);
}
