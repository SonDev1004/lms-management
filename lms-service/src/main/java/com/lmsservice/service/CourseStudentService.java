package com.lmsservice.service;

import com.lmsservice.repository.CourseStudentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseStudentService {
    CourseStudentRepository courseStudentRepository;
}

