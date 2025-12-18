package com.lmsservice.service.impl;

import com.lmsservice.common.paging.PageResponse;
import com.lmsservice.dto.request.CreateFeedbackRequest;
import com.lmsservice.dto.request.FeedbackFilterRequest;
import com.lmsservice.dto.response.FeedbackResponse;
import com.lmsservice.entity.Feedback;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.FeedbackRepository;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.service.FeedbackService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackServiceImpl implements FeedbackService {

    FeedbackRepository feedbackRepository;
    StudentRepository studentRepository;
    CourseRepository courseRepository;

    // === Academic / Admin ===
    @Override
    public PageResponse<FeedbackResponse> getFeedbacks(FeedbackFilterRequest filter, Pageable pageable) {
        // Tạm: chưa dùng filter, chỉ lấy all
        Page<Feedback> page = feedbackRepository.findAll(pageable);
        return PageResponse.from(page.map(this::toDto));
    }

    @Override
    public FeedbackResponse getFeedbackDetail(Long id) {
        Feedback f = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        return toDto(f);
    }

    // === STUDENT ===
    @Override
    public FeedbackResponse createFeedback(Long studentId, CreateFeedbackRequest request) {
        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        var course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Feedback f = new Feedback();
        f.setStudent(student);
        f.setCourse(course);
        if (request.getRating() != null) {
            // entity Feedback của bạn đang là String rating → convert
            f.setRating(Short.valueOf(String.valueOf(request.getRating())));
        }
        f.setContent(request.getContent());

        Feedback saved = feedbackRepository.save(f);
        return toDto(saved);
    }

    @Override
    public PageResponse<FeedbackResponse> getFeedbacksOfStudent(Long studentId, Pageable pageable) {
        Page<Feedback> page = feedbackRepository.findByStudent_Id(studentId, pageable);
        return PageResponse.from(page.map(this::toDto));
    }

    // === mapper chung ===
    private FeedbackResponse toDto(Feedback f) {
        var student = f.getStudent();
        var user = student != null ? student.getUser() : null;
        var course = f.getCourse();

        Integer rating = null;
        if (f.getRating() != null) {
            try {
                rating = Integer.valueOf(f.getRating());
            } catch (NumberFormatException ignored) {}
        }

        return FeedbackResponse.builder()
                .id(f.getId())
                .studentId(student != null ? student.getId() : null)
                .studentName(user != null ? user.getUserName() : null)
                .courseId(course != null ? course.getId() : null)
                .courseTitle(course != null ? course.getTitle() : null)
                .rating(rating)
                .content(f.getContent())
                .createdAt(f.getCreatedAt())
                .build();
    }
}
