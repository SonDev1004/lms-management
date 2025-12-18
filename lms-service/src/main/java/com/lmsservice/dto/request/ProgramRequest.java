package com.lmsservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProgramRequest {
    String code;
    String title;
    Integer minStudent;
    Integer maxStudent;
    Long fee;
    String description;
    String imageUrl;
    Boolean isActive;
}
