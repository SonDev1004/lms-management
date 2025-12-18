package com.lmsservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateFeedbackRequest {
    Long courseId;
    Integer rating;   // 1–5
    String content;
}
