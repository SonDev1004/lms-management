package com.lmsservice.repository;

import com.lmsservice.entity.Role;
import com.lmsservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String userName);

    Optional<User> findByUserNameOrEmail(String userName, String email);

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
                WHERE LOWER(u.userName) LIKE LOWER(CONCAT('%', :kw, '%'))
                OR LOWER(u.email) LIKE LOWER(CONCAT('%', :kw, '%'))
            """)
    List<User> searchUsers(@Param("kw") String keyword);
}
