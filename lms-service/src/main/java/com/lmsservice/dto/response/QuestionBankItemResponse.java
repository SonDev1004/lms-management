package com.lmsservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionBankItemResponse {
    private Long id;

    private Integer type;

    private String content;    // nội dung đầy đủ câu hỏi

    private String contentPreview;

    // Subject info
    private Long subjectId;
    private String subjectName;

    private String level;

}
