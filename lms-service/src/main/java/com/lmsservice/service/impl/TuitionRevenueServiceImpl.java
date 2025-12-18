package com.lmsservice.service.impl;

import com.lmsservice.dto.request.TuitionRevenueFilterRequest;
import com.lmsservice.dto.response.TuitionRevenueSummaryResponse;
import com.lmsservice.dto.response.TuitionTransactionResponse;
import com.lmsservice.entity.Enrollment;
import com.lmsservice.entity.PaymentHistory;
import com.lmsservice.entity.Program;
import com.lmsservice.entity.Student;
import com.lmsservice.entity.Subject;
import com.lmsservice.entity.User;
import com.lmsservice.repository.PaymentHistoryRepository;
import com.lmsservice.service.TuitionRevenueService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TuitionRevenueServiceImpl implements TuitionRevenueService {

    PaymentHistoryRepository paymentHistoryRepository;

    @Override
    public TuitionRevenueSummaryResponse getMonthlySummary(TuitionRevenueFilterRequest filter) {
        List<PaymentHistory> txns = loadMonthTransactions(filter);

        // áp dụng filter status / program / subject trong Java (đỡ viết query phức tạp)
        List<PaymentHistory> filtered = applyFilter(txns, filter);

        long transactions = filtered.size();
        long successCount = filtered.stream().filter(this::isSuccess).count();
        long failedCount = filtered.stream().filter(this::isFailed).count();

        BigDecimal totalCollected = filtered.stream().filter(this::isSuccess).map(PaymentHistory::getAmount).filter(a -> a != null).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal refundAmount = filtered.stream().filter(this::isFailed).map(PaymentHistory::getAmount).filter(a -> a != null).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgTicket = BigDecimal.ZERO;
        if (successCount > 0) {
            avgTicket = totalCollected.divide(BigDecimal.valueOf(successCount), 0, java.math.RoundingMode.HALF_UP);
        }

        return TuitionRevenueSummaryResponse.builder().year(filter.getYear()).month(filter.getMonth()).transactions(transactions).successCount(successCount).failedCount(failedCount).totalCollected(totalCollected).refundAmount(refundAmount).avgTicket(avgTicket).build();
    }

    @Override
    public List<TuitionTransactionResponse> getMonthlyTransactions(TuitionRevenueFilterRequest filter) {
        List<PaymentHistory> txns = loadMonthTransactions(filter);
        List<PaymentHistory> filtered = applyFilter(txns, filter);

        return filtered.stream().map(this::toDto).collect(Collectors.toList());
    }

    // ===== helpers =====

    private List<PaymentHistory> loadMonthTransactions(TuitionRevenueFilterRequest filter) {
        int year = filter.getYear();
        int month = filter.getMonth();
        LocalDate first = LocalDate.of(year, month, 1);
        LocalDateTime start = first.atStartOfDay();
        LocalDateTime end = first.plusMonths(1).atStartOfDay();

        // nếu dùng createdAt thì đổi method tương ứng ở repository
        return paymentHistoryRepository.findByPaymentDateBetween(start, end);
    }

    private List<PaymentHistory> applyFilter(List<PaymentHistory> list, TuitionRevenueFilterRequest filter) {
        return list.stream().filter(ph -> {
            if (filter.getStatus() != null && !"ALL".equalsIgnoreCase(filter.getStatus())) {
                if ("SUCCESS".equalsIgnoreCase(filter.getStatus()) && !isSuccess(ph)) return false;
                if ("FAILED".equalsIgnoreCase(filter.getStatus()) && !isFailed(ph)) return false;
            }
            Enrollment e = ph.getEnrollment();
            if (filter.getProgramId() != null) {
                Program p = (e != null ? e.getProgram() : null);
                if (p == null || !filter.getProgramId().equals(p.getId())) return false;
            }
            if (filter.getSubjectId() != null) {
                Subject s = (e != null ? e.getSubject() : null);
                if (s == null || !filter.getSubjectId().equals(s.getId())) return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    private boolean isSuccess(PaymentHistory ph) {
        return "SUCCESS".equalsIgnoreCase(ph.getTransactionStatus());
    }

    private boolean isFailed(PaymentHistory ph) {
        return !"SUCCESS".equalsIgnoreCase(ph.getTransactionStatus());
    }


    private TuitionTransactionResponse toDto(PaymentHistory ph) {
        Enrollment e = ph.getEnrollment();
        Student student = e != null ? e.getStudent() : null;
        User user = student != null ? student.getUser() : null;
        Program program = e != null ? e.getProgram() : null;
        Subject subject = e != null ? e.getSubject() : null;

        String studentName = user != null ? user.getUserName() : null;
        String studentCode = student != null ? student.getCode() : null;

        String programTitle = program != null ? program.getTitle() : null;
        String subjectTitle = subject != null ? subject.getTitle() : null;

        // mapping method / bank / tranNo / orderInfo theo entity thực tế
        // mapping method / bank / tranNo / orderInfo theo entity thực tế
        String method = ph.getPaymentMethod();  // ví dụ: "Cash", "Credit Card", "Bank Transfer"
        String bank = ph.getBankCode();
        String tranNo = ph.getBankTranNo() != null ? ph.getBankTranNo() : ph.getTransactionNo();
        String orderInfo = ph.getOrderInfo();

        return TuitionTransactionResponse.builder().id(ph.getId()).date(ph.getPaymentDate())
                .student(studentName)
                .code(studentCode)
                .program(programTitle)
                .subject(subjectTitle)
                .amount(ph.getAmount())
                .method(method).bank(bank)
                .tranNo(tranNo)
                .status(formatStatus(ph.getTransactionStatus())).orderInfo(orderInfo).build();
    }

    private String formatStatus(String raw) {
        if (raw == null) return "Unknown";
        String up = raw.toUpperCase(Locale.ROOT);
        if ("SUCCESS".equals(up) || "PAID".equals(up)) return "Success";
        if ("FAILED".equals(up) || "REFUND".equals(up)) return "Failed";
        return raw;
    }
}
