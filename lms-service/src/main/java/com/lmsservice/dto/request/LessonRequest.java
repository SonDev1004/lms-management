package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessonRequest {
    @NotBlank(message = "Title cannot be blank")
    String title;

    @NotBlank(message = "Content cannot be blank")
    String content;

    @NotBlank(message = "Description cannot be blank")
    String description;

    @NotBlank(message = "Document cannot be blank")
    String document;

    @NotNull(message = "Subject ID cannot be null")
    Long subjectId;
}
