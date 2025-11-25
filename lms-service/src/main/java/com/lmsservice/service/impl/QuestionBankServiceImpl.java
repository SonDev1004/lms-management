package com.lmsservice.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.request.CreateMcqQuestionRequest;
import com.lmsservice.dto.response.QuestionBankSummaryDto;
import com.lmsservice.entity.QuestionBank;
import com.lmsservice.entity.Subject;
import com.lmsservice.entity.User;
import com.lmsservice.repository.QuestionBankRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.QuestionBankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionBankServiceImpl implements QuestionBankService {

    private final QuestionBankRepository questionBankRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Override
    public QuestionBank createMcqSingle(CreateMcqQuestionRequest req, Long currentUserId) {
        QuestionBank qb = new QuestionBank();

        qb.setType(1); // 1 = MCQ one correct
        qb.setContent(req.getContent());

        if (req.getSubjectId() != null) {
            Subject subject = subjectRepository
                    .findById(req.getSubjectId())
                    .orElseThrow(() -> new IllegalArgumentException("Subject not found: " + req.getSubjectId()));
            qb.setSubject(subject);
        }

        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUserId));
        qb.setCreatedBy(creator);

        qb.setVisibility(req.getVisibility() != null ? req.getVisibility() : 1);
        qb.setIsActive(true);
        qb.setCreatedAt(LocalDateTime.now());

        try {
            String optionsJson = objectMapper.writeValueAsString(req.getOptions());
            qb.setOptionsJson(optionsJson);

            // lưu luôn dưới dạng mảng để sau này mở rộng multi-choice
            String answersJson = objectMapper.writeValueAsString(
                    new String[]{req.getCorrectKey()}
            );
            qb.setAnswersJson(answersJson);
        } catch (JsonProcessingException e) {
            log.error("Error serializing question JSON", e);
            throw new RuntimeException("Invalid option/answer JSON", e);
        }

        return questionBankRepository.save(qb);
    }

    @Override
    public void deactivate(Long questionId) {
        QuestionBank qb = questionBankRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + questionId));
        qb.setIsActive(false);
        questionBankRepository.save(qb);
    }

    @Override
    public Page<QuestionBankSummaryDto> searchQuestions(
            Long subjectId,
            Integer type,
            Boolean active,
            String keyword,
            Pageable pageable
    ) {
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        Page<QuestionBank> page = questionBankRepository.search(subjectId, type, active, kw, pageable);
        return page.map(this::toSummaryDto);
    }


    private QuestionBankSummaryDto toSummaryDto(QuestionBank q) {
        QuestionBankSummaryDto dto = new QuestionBankSummaryDto();
        dto.setId(q.getId());
        if (q.getSubject() != null) {
            dto.setSubjectId(q.getSubject().getId());
            dto.setSubjectTitle(q.getSubject().getTitle());
        }
        dto.setType(q.getType());
        String content = q.getContent();
        if (content != null && content.length() > 120) {
            dto.setContentPreview(content.substring(0, 120) + "...");
        } else {
            dto.setContentPreview(content);
        }
        dto.setVisibility(q.getVisibility());
        dto.setActive(q.getIsActive());
        dto.setCreatedBy(q.getCreatedBy().getId());
        dto.setCreatedAt(q.getCreatedAt());
        return dto;
    }
}
