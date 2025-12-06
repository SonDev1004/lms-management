// com.lmsservice.service.impl.AssignmentRetakeServiceImpl.java
package com.lmsservice.service.impl;

import com.lmsservice.dto.request.HandleAssignmentRetakeRequest;
import com.lmsservice.entity.Assignment;
import com.lmsservice.entity.AssignmentRetakeRequest;
import com.lmsservice.entity.Student;
import com.lmsservice.entity.User;
import com.lmsservice.exception.AppException;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.repository.AssignmentRepository;
import com.lmsservice.repository.AssignmentRetakeRequestRepository;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.repository.SubmissionRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.AssignmentRetakeService;
import com.lmsservice.util.AssignmentRetakeStatus;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class AssignmentRetakeServiceImpl implements AssignmentRetakeService {

    AssignmentRepository assignmentRepo;
    SubmissionRepository submissionRepo;
    AssignmentRetakeRequestRepository retakeRepo;
    StudentRepository studentRepo;
    UserRepository userRepo;

    @Override
    public void requestRetake(Long assignmentId, Long studentId, String reason) {
        Assignment assignment = assignmentRepo.findById(assignmentId)
                .orElseThrow(() -> new AppException(ErrorCode.ASSIGNMENT_NOT_FOUND));

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENT_NOT_IN_COURSE));

        // 1) Phải quá hạn
        if (assignment.getDueDate() != null &&
                assignment.getDueDate().isAfter(LocalDateTime.now())) {
            throw new AppException(ErrorCode.RETAKE_NOT_ALLOWED_NOT_OVERDUE);
        }

        // 2) Không được có submission trước đó
        boolean hasSubmission = submissionRepo
                .findTopByAssignment_IdAndStudent_IdOrderBySubmittedDateDesc(
                        assignmentId, studentId)
                .isPresent();
        if (hasSubmission) {
            throw new AppException(ErrorCode.RETAKE_NOT_ALLOWED_ALREADY_SUBMITTED);
        }

        // 3) Không được xin trùng (đã PENDING / APPROVED)
        boolean alreadyRequested = retakeRepo
                .findFirstByStudent_IdAndAssignment_IdAndStatusIn(
                        studentId,
                        assignmentId,
                        List.of(AssignmentRetakeStatus.PENDING, AssignmentRetakeStatus.APPROVED)
                )
                .isPresent();
        if (alreadyRequested) {
            throw new AppException(ErrorCode.RETAKE_ALREADY_REQUESTED);
        }

        AssignmentRetakeRequest req = new AssignmentRetakeRequest();
        req.setAssignment(assignment);
        req.setStudent(student);
        req.setReason(reason);
        req.setStatus(AssignmentRetakeStatus.PENDING);
        req.setCreatedAt(LocalDateTime.now());
        req.setUpdatedAt(LocalDateTime.now());

        retakeRepo.save(req);
    }

    @Override
    public void handleRetake(Long requestId, Long approverUserId, HandleAssignmentRetakeRequest body) {
        AssignmentRetakeRequest req = retakeRepo.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.RETAKE_REQUEST_NOT_FOUND));

        if (req.getStatus() != AssignmentRetakeStatus.PENDING) {
            throw new AppException(ErrorCode.RETAKE_ALREADY_HANDLED);
        }

        User approver = userRepo.findById(approverUserId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        req.setAdminNote(body.getAdminNote());
        req.setApprovedBy(approver);

        if (body.isApprove()) {
            req.setStatus(AssignmentRetakeStatus.APPROVED);
            LocalDateTime deadline =
                    body.getRetakeDeadline() != null
                            ? body.getRetakeDeadline()
                            : LocalDateTime.now().plusDays(2); // default 2 ngày
            req.setRetakeDeadline(deadline);
        } else {
            req.setStatus(AssignmentRetakeStatus.REJECTED);
        }

        req.setUpdatedAt(LocalDateTime.now());
        retakeRepo.save(req);
    }

    @Override
    public Optional<AssignmentRetakeRequest> findActiveRetake(Long assignmentId, Long studentId) {
        return retakeRepo.findFirstByStudent_IdAndAssignment_IdAndStatusIn(
                studentId,
                assignmentId,
                List.of(AssignmentRetakeStatus.PENDING, AssignmentRetakeStatus.APPROVED)
        );
    }

    @Override
    public List<AssignmentRetakeRequest> getRequestsForAssignment(Long assignmentId,
                                                                  AssignmentRetakeStatus status) {
        List<AssignmentRetakeRequest> all = retakeRepo.findByAssignment_Id(assignmentId);
        if (status == null) return all;
        return all.stream()
                .filter(r -> r.getStatus() == status)
                .toList();
    }
}
