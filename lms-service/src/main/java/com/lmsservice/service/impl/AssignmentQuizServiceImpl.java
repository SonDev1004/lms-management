package com.lmsservice.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lmsservice.dto.response.AssignmentQuestionConfig;
import com.lmsservice.dto.response.AssignmentQuizConfigItemDto;
import com.lmsservice.dto.response.AssignmentQuizConfigResponse;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.AssignmentDetail;
import com.lmsservice.entity.QuestionBank;
import com.lmsservice.repository.AssignmentDetailRepository;
import com.lmsservice.repository.AssignmentRepository;
import com.lmsservice.repository.QuestionBankRepository;
import com.lmsservice.service.AssignmentQuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentQuizServiceImpl implements AssignmentQuizService {

    private final AssignmentRepository assignmentRepository;
    private final QuestionBankRepository questionBankRepository;
    private final AssignmentDetailRepository assignmentDetailRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void configureAssignmentQuestions(Long assignmentId, List<AssignmentQuestionConfig> items) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        assignmentDetailRepository.deleteByAssignmentId(assignmentId);

        if (items == null || items.isEmpty()) {
            return;
        }

        for (AssignmentQuestionConfig item : items) {
            QuestionBank qb = questionBankRepository.findById(item.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Question not found: " + item.getQuestionId()));

            AssignmentDetail detail = new AssignmentDetail();
            detail.setAssignment(assignment);
            detail.setQuestion(qb);
            detail.setOrderNumber(item.getOrderNumber());
            detail.setPoints(item.getPoints());

            String snapshotJson = buildQuestionSnapshot(qb);
            detail.setQuestionSnapshotJson(snapshotJson);

            assignmentDetailRepository.save(detail);
        }
    }

    private String buildQuestionSnapshot(QuestionBank qb) {
        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("id", qb.getId());
        snapshot.put("type", qb.getType());
        snapshot.put("content", qb.getContent());
        snapshot.put("audioUrl", qb.getAudioUrl());

        try {
            // options
            Object options = null;
            if (qb.getOptionsJson() != null) {
                options = objectMapper.readValue(qb.getOptionsJson(), Object.class);
            }
            snapshot.put("options", options);

            // ===== NEW: correctKey từ answers_json =====
            String correctKey = extractCorrectKey(qb);
            snapshot.put("correctKey", correctKey);

            return objectMapper.writeValueAsString(snapshot);
        } catch (Exception e) {
            log.error("Error building question snapshot for question {}", qb.getId(), e);
            throw new RuntimeException("Error building question snapshot", e);
        }
    }

    /**
     * Lấy key đúng từ question_bank.answers_json.
     * Hỗ trợ các format: ["A"], "A", {"key":"A",...}, [{"key":"A",...}]
     */
    private String extractCorrectKey(QuestionBank qb) {
        String answersJson = qb.getAnswersJson();
        if (answersJson == null || answersJson.isBlank()) {
            return null;
        }

        try {
            JsonNode node = objectMapper.readTree(answersJson);

            if (node.isArray() && node.size() > 0) {
                JsonNode first = node.get(0);
                if (first.isTextual()) {
                    // ["A"]
                    return first.asText();
                }
                if (first.isObject() && first.hasNonNull("key")) {
                    // [{"key":"A","text":"..."}]
                    return first.get("key").asText();
                }
            } else if (node.isObject() && node.hasNonNull("key")) {
                // {"key":"A","text":"..."}
                return node.get("key").asText();
            } else if (node.isTextual()) {
                // "A"
                return node.asText();
            }
        } catch (Exception e) {
            log.warn("Cannot parse answers_json for QuestionBank {}: {}",
                    qb.getId(), e.getMessage(), e);
        }
        return null;
    }

    @Override
    public AssignmentQuizConfigResponse getQuizConfig(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));

        var details = assignmentDetailRepository.findByAssignmentIdOrderByOrderNumberAsc(assignmentId);

        AssignmentQuizConfigResponse resp = new AssignmentQuizConfigResponse();
        resp.setAssignmentId(assignment.getId());
        resp.setAssignmentTitle(assignment.getTitle());

        var items = details.stream()
                .map(this::toConfigItemDto)
                .toList();

        resp.setItems(items);
        return resp;
    }

    private AssignmentQuizConfigItemDto toConfigItemDto(AssignmentDetail d) {
        AssignmentQuizConfigItemDto dto = new AssignmentQuizConfigItemDto();
        dto.setAssignmentDetailId(d.getId());
        dto.setQuestionId(d.getQuestion().getId());
        dto.setOrderNumber(d.getOrderNumber());
        dto.setPoints(d.getPoints());

        String preview = null;
        String snapshot = d.getQuestionSnapshotJson();
        if (snapshot != null) {
            try {
                JsonNode node = objectMapper.readTree(snapshot);
                JsonNode contentNode = node.get("content");
                if (contentNode != null && contentNode.isTextual()) {
                    String c = contentNode.asText();
                    if (c.length() > 120) {
                        c = c.substring(0, 120) + "...";
                    }
                    preview = c;
                }
            } catch (Exception ignored) {
            }
        }
        dto.setQuestionContentPreview(preview);
        return dto;
    }
}
