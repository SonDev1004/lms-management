package com.lmsservice.spec;

import org.springframework.data.jpa.domain.Specification;
import com.lmsservice.dto.request.subject.SubjectFilterRequest;
import com.lmsservice.entity.Subject;

public final class SubjectSpecifications {
    private SubjectSpecifications() {}

    public static Specification<Subject> from(SubjectFilterRequest f) {
        Specification<Subject> spec = Specification.where(null);
        if (f == null) return spec;

        if (f.getTitle() != null && !f.getTitle().isBlank()) {
            String v = "%" + f.getTitle().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("title")), v));
        }

        if (f.getCode() != null && !f.getCode().isBlank()) {
            String v = "%" + f.getCode().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("code")), v));
        }

        if (f.getKeyword() != null && !f.getKeyword().isBlank()) {
            String kw = "%" + f.getKeyword().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), kw),
                    cb.like(cb.lower(root.get("description")), kw),
                    cb.like(cb.lower(root.get("code")), kw)
            ));
        }

        if (f.getFeeMin() != null) {
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("fee"), f.getFeeMin()));
        }
        if (f.getFeeMax() != null) {
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("fee"), f.getFeeMax()));
        }

        if (f.getIsActive() != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("isActive"), f.getIsActive()));
        }
        return spec;
    }
}
