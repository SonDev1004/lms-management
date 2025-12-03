package com.lmsservice.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("isActive")
    Boolean isActive;
    public Boolean getActive() {
        return isActive;
    }
    Long courseId;
    String courseTitle;
    Boolean status;
}
