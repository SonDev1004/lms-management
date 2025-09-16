package com.lmsservice.spec;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.lmsservice.dto.request.program.ProgramFilterRequest;
import com.lmsservice.entity.Program;

public final class ProgramSpecifications {
    private ProgramSpecifications() {}

    /**
     * Chỉ build các filter KHÁC status (đến đoạn quyền mới quyết định status)
     */
    private static Specification<Program> baseFilters(ProgramFilterRequest f) {
        Specification<Program> spec = Specification.where(null);
        if (f == null) return spec;

        spec = spec.and(SpecUtils.likeIgnoreCase("title", f.getTitle()))
                .and(SpecUtils.likeIgnoreCase("code", f.getCode()))
                .and(SpecUtils.between("fee", f.getFeeMin(), f.getFeeMax()));

        // ✅ OR keyword chỉ khi có giá trị
        if (f.getKeyword() != null && !f.getKeyword().isBlank()) {
            spec = spec.and(SpecUtils.anyOf(List.of(
                    SpecUtils.likeIgnoreCase("title", f.getKeyword()), SpecUtils.likeIgnoreCase("code", f.getKeyword())
                    // nếu muốn: SpecUtils.likeIgnoreCase("description", f.getKeyword())
                    )));
        }
        return spec;
    }

    /**
     * Tiện ích: gói status cho dễ đọc (dùng SpecUtils.eq như bạn đang làm)
     */
    public static Specification<Program> isActive(Boolean value) {
        return SpecUtils.eq("isActive", value);
    }

    /**
     * Quyết định status dựa vào quyền:
     * - canViewAll = true  → tôn trọng f.status (nếu client có gửi)
     * - canViewAll = false → luôn ép status = true
     */
    private static Specification<Program> visibility(boolean canViewAll, Boolean requestedIsActive) {
        if (canViewAll) {
            // tôn trọng filter client nếu có
            return requestedIsActive == null ? null : isActive(requestedIsActive);
        }
        return isActive(true);
    }

    /**
     * ✅ Entry point DUY NHẤT để build spec (khuyến nghị dùng ở mọi nơi)
     */
    public static Specification<Program> from(ProgramFilterRequest f, boolean canViewAll) {
        Specification<Program> spec = baseFilters(f); // KHÔNG chứa status
        if (canViewAll) {
            if (f != null && f.getIsActive() != null) {
                spec = spec.and(isActive(f.getIsActive()));
            }
        } else {
            spec = spec.and(isActive(true));
        }
        return spec;
    }

    /**
     * Giữ hàm cũ để tương thích ngược (mặc định coi như có quyền xem all)
     */
    @Deprecated
    public static Specification<Program> from(ProgramFilterRequest f) {
        return from(f, true);
    }
}
