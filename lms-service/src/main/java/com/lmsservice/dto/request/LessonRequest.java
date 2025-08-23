package com.lmsservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.data.domain.Pageable;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessonRequest {
    @NotBlank(message = "Title cannot be blank")
    String title;

    @NotBlank(message = "Content cannot be blank")
    String content;

    @Builder.Default()
    String description = "";

    @Builder.Default()
    String document = "";

    @NotNull(message = "Subject ID cannot be null")
    Long subjectId;

    public Pageable getOtherParam() {
        return Pageable.unpaged();
    }
}
