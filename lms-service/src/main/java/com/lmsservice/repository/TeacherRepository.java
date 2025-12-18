package com.lmsservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Teacher;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long>, JpaSpecificationExecutor<Teacher> {
    Optional<Teacher> findByUser_Id(Long userId);
    @Query("""
           SELECT t 
           FROM Teacher t
           JOIN t.user u
           WHERE 
               LOWER(CONCAT(
                   COALESCE(u.firstName, ''), ' ',
                   COALESCE(u.lastName, ''), ' ',
                   COALESCE(u.userName, ''), ' ',
                   COALESCE(u.email, '')
               )) LIKE LOWER(CONCAT('%', :q, '%'))
           """)
    List<Teacher> searchByName(@Param("q") String q);
}
