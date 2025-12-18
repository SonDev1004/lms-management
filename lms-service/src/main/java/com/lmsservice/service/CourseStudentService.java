package com.lmsservice.service;


import com.lmsservice.util.EnrollmentSource;

public interface CourseStudentService {

    void addStudentToCourse(Long courseId, Long studentId, EnrollmentSource source);
}
