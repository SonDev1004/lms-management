package com.lmsservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackFilterRequest {

    String keyword;

    Long courseId;

    Long studentId;

    Integer ratingFrom;
}
