package com.lmsservice.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentResponse {
    String title;
    String maxScore;
    String fileName;
    Integer factor;
    LocalDateTime dueDate;
    boolean isActive;
    Long courseId;
    String courseTitle;
}
