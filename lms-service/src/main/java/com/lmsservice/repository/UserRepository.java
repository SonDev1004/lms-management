package com.lmsservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Role;
import com.lmsservice.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUserName(String userName);

	Optional<User> findByUserNameOrEmail(String userName, String email);

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	boolean existsByUserName(String userName);

	List<User> findByRole_NameIgnoreCase(String roleName);

	List<User> findByRoleIn(List<Role> roles);

	@Query("""
        SELECT s.user FROM Student s
        JOIN CourseStudent cs ON cs.student = s
        WHERE cs.course.id IN :courseIds
    """)
	List<User> findStudentsByCourseIds(@Param("courseIds") List<Long> courseIds);

	@Query("""
        SELECT s.user FROM Student s
        JOIN Enrollment e ON e.student = s
        WHERE e.program.id IN :programIds
    """)
	List<User> findStudentsByProgramIds(@Param("programIds") List<Long> programIds);

	@Query("""
        SELECT u FROM User u
        WHERE (:q IS NULL OR :q = '' OR
            LOWER(u.userName) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%',:q,'%'))
        )
    """)
	List<User> searchUsers(@Param("q") String q);

	@EntityGraph(attributePaths = {"role"})
	@Query("""
        SELECT u FROM User u
        LEFT JOIN u.role r
        WHERE (:role IS NULL OR :role = '' OR UPPER(r.name) = UPPER(:role))
          AND (:q IS NULL OR :q = '' OR
            LOWER(u.userName) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(u.firstName) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(u.lastName) LIKE LOWER(CONCAT('%',:q,'%')) OR
            LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%',:q,'%'))
          )
    """)
	Page<User> searchUsersPage(@Param("role") String role,
							   @Param("q") String q,
							   Pageable pageable);
}
