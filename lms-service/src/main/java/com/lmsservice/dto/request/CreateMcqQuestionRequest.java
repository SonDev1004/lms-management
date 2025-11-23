package com.lmsservice.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateMcqQuestionRequest {
    private Long subjectId;           // có thể null
    private String content;           // đề bài
    private List<OptionDto> options;  // danh sách option
    private String correctKey;        // key của đáp án đúng (ví dụ "A", "B"...)
    private Integer visibility = 1;   // 0=private, 1=shared

    @Data
    public static class OptionDto {
        private String key;           // "A", "B", "C"...
        private String text;          // nội dung hiển thị
    }
}
