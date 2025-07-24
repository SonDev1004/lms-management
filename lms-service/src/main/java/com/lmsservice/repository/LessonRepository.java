package com.lmsservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lmsservice.entity.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {}
