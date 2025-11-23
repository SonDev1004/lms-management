package com.lmsservice.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AssignmentResponse {
    Long id;
    String title;
    String maxScore;
    String fileName;
    Integer factor;
    LocalDateTime dueDate;
    List<String> assignmentType;
    boolean isActive;
    Long courseId;
    String courseTitle;
    Boolean status;
}
