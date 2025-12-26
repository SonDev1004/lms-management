package com.lmsservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseStatusScheduler {

    private final CourseService courseService;

    @Scheduled(cron = "0 */5 * * * *") // mỗi 5 phút
    public void updateCourseStatus() {
        courseService.refreshCourseStatusesMvp();
    }

}

