package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class CurriculumRequest {
    @NotNull(message = "Subject ID cannot be null")
    Long subjectId;
}
