package com.lmsservice.spec;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.lmsservice.dto.request.program.ProgramFilterRequest;
import com.lmsservice.entity.Program;

public final class ProgramSpecifications {
    private ProgramSpecifications() {}

    public static Specification<Program> from(ProgramFilterRequest f) {

        Specification<Program> base = Specification.<Program>where(null); // ghim kiểu 1 lần

        if (f == null) return base; // nếu filter null thì trả về spec rỗng

        List<Specification<Program>> keywordSpecs = List.of(
                SpecUtils.likeIgnoreCase("title", f.getKeyword()), SpecUtils.likeIgnoreCase("code", f.getKeyword()));
        return base.and(SpecUtils.likeIgnoreCase("title", f.getTitle()))
                .and(SpecUtils.likeIgnoreCase("code", f.getCode()))
                .and(SpecUtils.between("fee", f.getFeeMin(), f.getFeeMax()))
                .and(SpecUtils.eq("isActive", f.getIsActive()))
                .and(SpecUtils.anyOf(keywordSpecs));
    }
}
