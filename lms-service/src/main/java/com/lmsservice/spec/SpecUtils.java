package com.lmsservice.spec;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

/**
 * Tiện ích build Specification<T> gọn:
 * - Trả về null nếu input null/rỗng -> có thể .and(...) / .or(...) mà không cần if.
 * - Hỗ trợ theo "đường dẫn" (path) dạng "a.b.c" cho quan hệ to-one.
 */
public final class SpecUtils {
    private SpecUtils() {}

    /* ------------------ Combinators ------------------ */

    /**
     * AND tất cả spec hợp lệ trong list (bỏ qua null).
     */
    public static <T> Specification<T> allOf(List<Specification<T>> specs) {
        Specification<T> acc = Specification.where(null);
        if (specs == null) return acc;
        for (Specification<T> s : specs) if (s != null) acc = acc.and(s);
        return acc;
    }

    /**
     * OR tất cả spec hợp lệ trong list (bỏ qua null).
     */
    public static <T> Specification<T> anyOf(List<Specification<T>> specs) {
        if (specs == null || specs.isEmpty()) return null;
        Specification<T> acc = null;
        for (Specification<T> s : specs) {
            if (s == null) continue;
            acc = (acc == null) ? Specification.where(s) : acc.or(s);
        }
        return acc;
    }

    /* ------------------ Type-safe (lambda selector) ------------------ */

    public static <T, R> Specification<T> eq(Function<Root<T>, Expression<R>> sel, R value) {
        if (value == null) return null;
        return (root, q, cb) -> cb.equal(sel.apply(root), value);
    }

    public static <T> Specification<T> likeIgnoreCase(Function<Root<T>, Expression<String>> sel, String term) {
        if (term == null || term.isBlank()) return null;
        String p = "%" + term.trim().toLowerCase() + "%";
        return (root, q, cb) -> cb.like(cb.lower(sel.apply(root)), p);
    }

    public static <T, N extends Comparable<N>> Specification<T> gte(Function<Root<T>, Expression<N>> sel, N min) {
        if (min == null) return null;
        return (root, q, cb) -> cb.greaterThanOrEqualTo(sel.apply(root), min);
    }

    public static <T, N extends Comparable<N>> Specification<T> lte(Function<Root<T>, Expression<N>> sel, N max) {
        if (max == null) return null;
        return (root, q, cb) -> cb.lessThanOrEqualTo(sel.apply(root), max);
    }

    public static <T, R> Specification<T> in(Function<Root<T>, Expression<R>> sel, Collection<R> values) {
        if (values == null || values.isEmpty()) return null;
        return (root, q, cb) -> sel.apply(root).in(values);
    }

    /* ------------------ Path-based (string "a.b.c") ------------------ */

    public static <T> Specification<T> eq(String path, Object value) {
        if (value == null) return null;
        return (root, q, cb) -> cb.equal(resolve(root, path), value);
    }

    public static <T> Specification<T> likeIgnoreCase(String path, String term) {
        if (term == null || term.isBlank()) return null;
        String p = "%" + term.trim().toLowerCase() + "%";
        return (root, q, cb) -> cb.like(cb.lower(resolve(root, path).as(String.class)), p);
    }

    /**
     * Khoảng [min, max]; nếu chỉ có một đầu thì dùng gte/lte tương ứng.
     */
    public static <T, N extends Comparable<N>> Specification<T> between(String path, N min, N max) {
        if (min == null && max == null) return null;
        return (root, q, cb) -> {
            Path<N> p = resolve(root, path);
            if (min != null && max != null) return cb.between(p, min, max);
            if (min != null) return cb.greaterThanOrEqualTo(p, min);
            return cb.lessThanOrEqualTo(p, max);
        };
    }

    public static <T, R> Specification<T> in(String path, Collection<R> values) {
        if (values == null || values.isEmpty()) return null;
        return (root, q, cb) -> resolve(root, path).in(values);
    }

    /* ------------------ Helpers ------------------ */

    @SuppressWarnings("unchecked")
    private static <T, R> Path<R> resolve(Root<T> root, String dotPath) {
        Path<?> p = root;
        for (String part : dotPath.split("\\.")) {
            p = p.get(part);
        }
        return (Path<R>) p;
    }
}
