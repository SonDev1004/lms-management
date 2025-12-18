package com.lmsservice.dto.response;


import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackResponse {
    Long id;

    Long studentId;
    String studentName;

    Long courseId;
    String courseTitle;

    Integer rating;
    String content;

    LocalDateTime createdAt;
}
