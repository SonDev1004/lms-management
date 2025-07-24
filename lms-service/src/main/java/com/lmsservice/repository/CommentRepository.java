package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {}
