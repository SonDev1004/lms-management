package com.lmsservice.spec;

import org.springframework.data.jpa.domain.Specification;

import com.lmsservice.dto.request.program.ProgramFilterRequest;
import com.lmsservice.entity.Program;

public final class ProgramSpecifications {
    private ProgramSpecifications() {}

    public static Specification<Program> from(ProgramFilterRequest f) {
        Specification<Program> spec = Specification.<Program>where(null);
        if (f == null) return spec;

        spec = spec.and(SpecUtils.likeIgnoreCase("title", f.getTitle()))
                .and(SpecUtils.likeIgnoreCase("code", f.getCode()))
                .and(SpecUtils.between("fee", f.getFeeMin(), f.getFeeMax()))
                .and(SpecUtils.eq("isActive", f.getIsActive()));

        // ✅ Chỉ thêm khối OR khi keyword có giá trị
        if (f.getKeyword() != null && !f.getKeyword().isBlank()) {
            spec = spec.and(SpecUtils.anyOf(java.util.Arrays.asList(
                    SpecUtils.likeIgnoreCase("title", f.getKeyword()),
                    SpecUtils.likeIgnoreCase("code", f.getKeyword()))));
        }

        return spec;
    }
}
