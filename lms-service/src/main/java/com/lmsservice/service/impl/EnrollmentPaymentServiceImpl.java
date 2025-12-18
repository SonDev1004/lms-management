package com.lmsservice.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lmsservice.dto.response.PaymentResultResponse;
import com.lmsservice.entity.Course;
import com.lmsservice.entity.CourseStudent;
import com.lmsservice.entity.Enrollment;
import com.lmsservice.entity.PendingEnrollment;
import com.lmsservice.entity.PaymentHistory;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Role;
import com.lmsservice.entity.Student;
import com.lmsservice.entity.Subject;
import com.lmsservice.entity.User;
import com.lmsservice.exception.ErrorCode;
import com.lmsservice.exception.UnAuthorizeException;
import com.lmsservice.repository.CourseRepository;
import com.lmsservice.repository.CourseStudentRepository;
import com.lmsservice.repository.EnrollmentRepository;
import com.lmsservice.repository.PaymentHistoryRepository;
import com.lmsservice.repository.PendingEnrollmentRepository;
import com.lmsservice.repository.ProgramRepository;
import com.lmsservice.repository.RoleRepository;
import com.lmsservice.repository.SessionRepository;
import com.lmsservice.repository.StudentRepository;
import com.lmsservice.repository.SubjectRepository;
import com.lmsservice.repository.UserRepository;
import com.lmsservice.service.EnrollmentPaymentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnrollmentPaymentServiceImpl implements EnrollmentPaymentService {

    private final PendingEnrollmentRepository pendingRepo;
    private final ProgramRepository programRepo;
    private final SubjectRepository subjectRepo;
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final StudentRepository studentRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final PaymentHistoryRepository paymentHistoryRepo;

    private final SessionRepository sessionRepo;
    private final CourseRepository courseRepo;
    private final CourseStudentRepository courseStudentRepo;

    @Override
    @Transactional
    public PendingEnrollment createPending(
            Long userId,
            Long programId,
            Long subjectId,
            String trackCode,
            Long courseId,
            BigDecimal totalFee,
            String txnRef
    ) {
        if (pendingRepo.findByTxnRef(txnRef).isPresent()) {
            throw new IllegalArgumentException("Transaction reference already exists");
        }

        BigDecimal fee;
        Course chosenCourse = null;

        if (programId != null) {
            fee = programRepo.findById(programId)
                    .map(Program::getFee)
                    .orElseThrow(() -> new IllegalArgumentException("Program not found"));

            if (trackCode == null || trackCode.trim().isBlank()) {
                throw new IllegalArgumentException("trackCode required for program enrollment");
            }
            trackCode = trackCode.trim();

            // program không cần courseId cụ thể
            chosenCourse = null;

        } else if (subjectId != null) {
            fee = subjectRepo.findById(subjectId)
                    .map(Subject::getFee)
                    .orElseThrow(() -> new IllegalArgumentException("Subject not found"));

            // mua lẻ subject -> bắt buộc chọn course
            if (courseId == null) {
                throw new IllegalArgumentException("courseId required for subject enrollment");
            }

            chosenCourse = courseRepo.findById(courseId)
                    .orElseThrow(() -> new IllegalArgumentException("Course not found"));

            // đảm bảo course thuộc đúng subjectId
            if (chosenCourse.getSubject() == null
                    || chosenCourse.getSubject().getId() == null
                    || !chosenCourse.getSubject().getId().equals(subjectId)) {
                throw new IllegalArgumentException("courseId does not belong to subjectId");
            }

            // subject không dùng trackCode
            trackCode = null;

        } else {
            throw new IllegalArgumentException("ProgramId or SubjectId required");
        }

        PendingEnrollment p = PendingEnrollment.builder()
                .txnRef(txnRef)
                .userId(userId)
                .programId(programId)
                .subjectId(subjectId)
                .trackCode(trackCode)
                .course(chosenCourse)
                .amount(fee)
                .totalFee(fee)
                .status("PENDING")
                .build();

        return pendingRepo.save(p);
    }

    private String buildAttendanceJson(int sessionCount) {
        if (sessionCount <= 0) return "[]";

        StringBuilder sb = new StringBuilder();
        sb.append('[');
        for (int i = 0; i < sessionCount; i++) {
            if (i > 0) sb.append(',');
            sb.append("{\"status\":0,\"note\":null}");
        }
        sb.append(']');
        return sb.toString();
    }

    private void ensureCourseStudent(Student student, Course course) {
        // capacity
        if (course.getCapacity() != null) {
            long enrolledCount = courseStudentRepo.countByCourseId(course.getId());
            if (enrolledCount >= course.getCapacity()) {
                throw new UnAuthorizeException(ErrorCode.COURSE_FULL);
            }
        }

        boolean existed = courseStudentRepo.existsByStudentIdAndCourseId(student.getId(), course.getId());
        if (existed) return;

        int sessionCount = sessionRepo.countByCourseId(course.getId());

        CourseStudent cs = new CourseStudent();
        cs.setStudent(student);
        cs.setCourse(course);
        cs.setIsAudit(false);
        cs.setAverageScore(null);
        cs.setAttendanceList(buildAttendanceJson(sessionCount));
        cs.setNote(null);
        cs.setStatus(1);

        courseStudentRepo.save(cs);
    }

    @Override
    @Transactional
    public Enrollment finalizeSuccessfulPayment(String txnRef, Map<String, String> vnpParams) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));

        if ("SUCCESS".equalsIgnoreCase(pending.getStatus())) {
            throw new IllegalStateException("Already processed");
        }

        // 1) validate paid amount
        BigDecimal paid = new BigDecimal(vnpParams.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
        if (pending.getTotalFee().compareTo(paid) != 0) {
            throw new UnAuthorizeException(ErrorCode.PAYMENT_AMOUNT_MISMATCH);
        }

        // 2) get/create student
        Long userId = pending.getUserId();
        Student student = studentRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new UnAuthorizeException(ErrorCode.USER_NOT_FOUND));
            Student s = new Student();
            s.setUser(user);
            return studentRepo.save(s);
        });

        // 3) auto-enroll
        if (pending.getProgramId() != null) {
            String trackCode = pending.getTrackCode();
            if (trackCode == null || trackCode.trim().isBlank()) {
                throw new UnAuthorizeException(ErrorCode.TRACK_CODE_REQUIRED);
            }

            List<Course> courses = courseRepo.findByTrackCodeOrderByCurriculumOrderAsc(trackCode);
            if (courses == null || courses.isEmpty()) {
                throw new UnAuthorizeException(ErrorCode.TRACK_NOT_FOUND);
            }

            Long programId = pending.getProgramId();
            boolean mismatchProgram = courses.stream().anyMatch(c ->
                    c.getProgram() == null
                            || c.getProgram().getId() == null
                            || !c.getProgram().getId().equals(programId)
            );
            if (mismatchProgram) {
                throw new UnAuthorizeException(ErrorCode.TRACK_NOT_FOUND);
            }

            for (Course c : courses) {
                ensureCourseStudent(student, c);
            }

        } else if (pending.getSubjectId() != null) {
            // mua subject lẻ: enroll đúng 1 course đã chọn
            Course c = pending.getCourse();
            if (c == null || c.getId() == null) {
                throw new UnAuthorizeException(ErrorCode.INVALID_REQUEST);
            }
            Course course = courseRepo.findById(c.getId())
                    .orElseThrow(() -> new UnAuthorizeException(ErrorCode.COURSE_NOT_FOUND));

            ensureCourseStudent(student, course);
        }

        // 4) create enrollment
        Enrollment enr = new Enrollment();
        enr.setStudent(student);
        enr.setProgram(pending.getProgramId() != null ? programRepo.findById(pending.getProgramId()).orElse(null) : null);
        enr.setSubject(pending.getSubjectId() != null ? subjectRepo.findById(pending.getSubjectId()).orElse(null) : null);
        enr.setPaidFee(pending.getTotalFee());
        enr.setRemainingFee(BigDecimal.ZERO);

        Enrollment savedEnr = enrollmentRepo.save(enr);

        // 5) payment history
        PaymentHistory ph = new PaymentHistory();
        ph.setEnrollment(savedEnr);
        ph.setAmount(paid);
        ph.setBankCode(vnpParams.get("vnp_BankCode"));
        ph.setBankTranNo(vnpParams.get("vnp_BankTranNo"));
        ph.setCardType(vnpParams.get("vnp_CardType"));
        ph.setOrderInfo(vnpParams.get("vnp_OrderInfo"));
        ph.setTransactionNo(vnpParams.get("vnp_TransactionNo"));
        ph.setResponseCode(vnpParams.get("vnp_ResponseCode"));
        ph.setTransactionStatus("SUCCESS");
        ph.setReferenceNumber(txnRef);
        ph.setPaymentMethod("VNPAY");
        ph.setPaymentDate(LocalDateTime.now());
        paymentHistoryRepo.save(ph);

        // 6) update pending
        pending.setStatus("SUCCESS");
        pendingRepo.save(pending);

        // 7) assign STUDENT role
        userRepo.findById(userId).ifPresent(user -> {
            roleRepo.findByName("STUDENT").ifPresent(role -> {
                Role cur = user.getRole();
                if (cur == null || !role.equals(cur)) {
                    user.setRole(role);
                    userRepo.save(user);
                }
            });
        });

        return savedEnr;
    }

    @Override
    @Transactional
    public void markPendingFailed(String txnRef, String reason) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));
        pending.setStatus("FAILED");
        pendingRepo.save(pending);
    }

    @Override
    @Transactional
    public void markPendingCancelled(String txnRef, String reason) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));
        pending.setStatus("CANCELLED");
        pendingRepo.save(pending);
    }

    @Scheduled(fixedRate = 60000)
    @Override
    @Transactional
    public void expirePendingEnrollments() {
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(15);
        List<PendingEnrollment> expired = pendingRepo.findAllByStatusAndCreatedAtBefore("PENDING", expiryTime);
        expired.forEach(p -> {
            p.setStatus("EXPIRED");
            pendingRepo.save(p);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResultResponse getPaymentResult(String txnRef) {
        PendingEnrollment pending = pendingRepo.findByTxnRef(txnRef)
                .orElseThrow(() -> new UnAuthorizeException(ErrorCode.PENDING_NOT_FOUND));

        var paymentHistoryOpt = paymentHistoryRepo.findByReferenceNumber(txnRef);
        Long enrollmentId = paymentHistoryOpt.map(ph -> ph.getEnrollment().getId()).orElse(null);
        String orderInfo = paymentHistoryOpt.map(PaymentHistory::getOrderInfo).orElse("Enroll " + txnRef);

        return PaymentResultResponse.builder()
                .txnRef(txnRef)
                .status(pending.getStatus())
                .totalFee(pending.getTotalFee())
                .programId(pending.getProgramId())
                .programName(
                        pending.getProgramId() != null
                                ? programRepo.findById(pending.getProgramId()).map(Program::getTitle).orElse(null)
                                : null
                )
                .subjectId(pending.getSubjectId())
                .subjectName(
                        pending.getSubjectId() != null
                                ? subjectRepo.findById(pending.getSubjectId()).map(Subject::getTitle).orElse(null)
                                : null
                )
                .enrollmentId(enrollmentId)
                .userId(pending.getUserId())
                .orderInfo(orderInfo)
                .currency("VND")
                .message("SUCCESS".equalsIgnoreCase(pending.getStatus())
                        ? "Thanh toán thành công"
                        : "Giao dịch " + pending.getStatus())
                .build();
    }
}
