package com.lmsservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    /// @EntityGraph(attributePaths = {"user"}): Khi JPA lấy danh sách Student,
    /// nó sẽ thực hiện JOIN với bảng User và lấy luôn dữ liệu User.
    @EntityGraph(attributePaths = "user")
    List<Student> findAll();
}
