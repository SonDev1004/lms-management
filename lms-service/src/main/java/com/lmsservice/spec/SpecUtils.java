package com.lmsservice.spec;

// ❖ Package chứa các tiện ích (utils) để xây dựng Specification<T> dùng chung cho MỌI entity.

// --- Import cần thiết ---

import org.springframework.data.jpa.domain.Specification;
// ❖ Specification<T>: giao diện của Spring Data để mô tả điều kiện WHERE (Predicate) bằng Criteria API.

import jakarta.persistence.criteria.Path;
// ❖ Path<?>: đại diện "đường dẫn" tới thuộc tính trong Criteria (vd root.get("name"), root.get("brand").get("name")).

import java.util.Collection;
// ❖ Dùng cho toán tử IN: nhận một tập giá trị.

// ❖ Utility class (chỉ có static method) → final + private constructor để không cho khởi tạo/extend.
public final class SpecUtils {
    private SpecUtils() {
        // ❖ Ngăn tạo instance: SpecUtils chỉ là hộp đồ nghề static.
    }

    /**
     * path(root, property): Resolve "đường dẫn thuộc tính" có thể là nested, ví dụ:
     * - "name"         -> root.get("name")
     * - "brand.name"   -> root.get("brand").get("name")
     *
     * @param root     Path<?> hiện tại (thường truyền root ngay từ Specification lambda)
     * @param property Chuỗi tên thuộc tính, cho phép nested bằng dấu chấm "."
     * @return Path<?> trỏ tới thuộc tính cuối cùng
     * <p>
     * Lý do tách hàm:
     * - Giúp các toán tử eq/like/in/gte/lte hoạt động dựa trên "tên thuộc tính" thay vì phải viết join/get thủ công.
     * - Hạn chế lặp code. Đơn giản hoá khi áp dụng cho nhiều entity.
     * <p>
     * Lưu ý:
     * - Nếu property trỏ tới collection (to-many) thì Path này có thể không đủ; khi đó nên viết spec riêng dùng join().
     */
    private static Path<?> path(Path<?> root, String property) {
        Path<?> p = root;                      // ❖ Bắt đầu từ root (entity gốc trong query).
        for (String part : property.split("\\.")) p = p.get(part);
        // ❖ Mỗi phần "a.b.c" sẽ lần lượt .get("a").get("b").get("c")
        return p;                              // ❖ Trả về Path cuối cùng (điểm tới thuộc tính muốn so sánh).
    }

    /**
     * eq: so sánh bằng (==) cho mọi kiểu.
     *
     * @param path Tên thuộc tính (có thể nested, vd "category", "brand.name")
     * @param val  Giá trị cần so sánh; nếu null => bỏ qua điều kiện
     * @return Specification<T> tương ứng hoặc null (để allOf/anyOf tự bỏ qua)
     * <p>
     * Vì sao return null khi val == null?
     * - Spring Data sẽ "bỏ qua" spec null khi bạn ghép bằng Specification.allOf(...),
     * giúp chúng ta dễ dàng xây filter động (truyền gì lọc nấy).
     */
    public static <T> Specification<T> eq(String path, Object val) {
        return (root, query, cb) -> val == null ? null : cb.equal(path(root, path), val);
        // ❖ cb.equal(Path, value): tạo Predicate "path = value".
        // ❖ path(root, path): resolve Path<?> từ tên thuộc tính truyền vào.
    }

    /**
     * equalsIgnoreCase: so sánh bằng KHÔNG phân biệt hoa/thường (chỉ áp dụng String).
     *
     * @param path Thuộc tính String
     * @param val  Giá trị String cần so sánh (case-insensitive); null => bỏ qua
     *             <p>
     *             Kỹ thuật:
     *             - ép Path thành String: .as(String.class)
     *             - lower cả 2 phía: cb.equal(cb.lower(field), lower(value))
     *             <p>
     *             Lưu ý hiệu năng:
     *             - Dùng lower(...) có thể làm DB không tận dụng index thường; cân nhắc functional index (LOWER(field)).
     */
    public static <T> Specification<T> equalsIgnoreCase(String path, String val) {
        return (root, query, cb) -> val == null ? null :
                cb.equal(cb.lower(path(root, path).as(String.class)), val.toLowerCase());
    }

    /**
     * likeIgnoreCase: so khớp CONTAINS không phân biệt hoa/thường (String).
     *
     * @param path Thuộc tính String
     * @param val  Từ khoá cần tìm; null/blank => bỏ qua
     * @return Predicate "LOWER(field) LIKE %lower(val)%"
     * <p>
     * Dùng cho search mềm (keyword). Nếu muốn bắt đầu bằng/ kết thúc bằng,
     * hãy đổi pattern: val.toLowerCase() + "%" (startsWith) hoặc "%" + val.toLowerCase() (endsWith).
     */
    public static <T> Specification<T> likeIgnoreCase(String path, String val) {
        return (root, query, cb) -> (val == null || val.isBlank()) ? null :
                cb.like(cb.lower(path(root, path).as(String.class)), "%" + val.toLowerCase() + "%");
    }

    /**
     * in: toán tử IN cho tập giá trị.
     *
     * @param path   Thuộc tính bất kỳ
     * @param values Tập giá trị (Collection); null hoặc rỗng => bỏ qua
     * @return Predicate "field IN (values)"
     * <p>
     * Lưu ý:
     * - Không trả Predicate "IN ()" rỗng (sai cú pháp) => nếu list rỗng => return null để bỏ qua.
     */
    public static <T> Specification<T> in(String path, Collection<?> values) {
        return (root, query, cb) -> (values == null || values.isEmpty()) ? null : path(root, path).in(values);
    }

    /**
     * gte: so sánh >= cho kiểu Comparable (vd BigDecimal, LocalDate, Integer...)
     *
     * @param path Thuộc tính kiểu Comparable
     * @param min  Giá trị min; null => bỏ qua
     *             <p>
     *             Chú thích @SuppressWarnings:
     *             - CriteriaBuilder API yêu cầu Path<? extends Comparable> khi so sánh >= <=
     *             - Ta cast Path<?> về Path<? extends Comparable> dựa trên contract "thuộc tính này phải Comparable".
     *             - Nếu property không thực sự Comparable → lỗi sẽ lộ khi chạy, nên hãy dùng đúng kiểu.
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <T> Specification<T> gte(String path, Comparable min) {
        return (root, query, cb) -> min == null ? null :
                cb.greaterThanOrEqualTo((Path<? extends Comparable>) path(root, path), min);
        // ❖ cb.greaterThanOrEqualTo(Path<Comparable>, min): tạo Predicate "field >= min".
    }

    /**
     * lte: so sánh <= cho kiểu Comparable.
     *
     * @param path Thuộc tính Comparable
     * @param max  Giá trị max; null => bỏ qua
     *             <p>
     *             Tương tự gte, cần cast Path về loại Comparable theo API Criteria.
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    public static <T> Specification<T> lte(String path, Comparable max) {
        return (root, query, cb) -> max == null ? null :
                cb.lessThanOrEqualTo((Path<? extends Comparable>) path(root, path), max);
        // ❖ cb.lessThanOrEqualTo(Path<Comparable>, max): "field <= max".
    }
}

/*
 * GỢI Ý MỞ RỘNG:
 * 1) between(String path, Comparable min, Comparable max):
 *    - Nếu cả min & max null → return null.
 *    - Nếu chỉ min có → >= min; chỉ max có → <= max; cả hai → BETWEEN.
 *
 * 2) notEq / notLike / isNull / isNotNull:
 *    - Tuỳ dự án, bổ sung thêm các toán tử phủ định hoặc kiểm tra null.
 *
 * 3) Join phức tạp (to-many):
 *    - Với thuộc tính collection, Path<?> thiếu join → cần viết spec riêng (root.join("...")).
 *    - Khi join collection + phân trang: tránh fetch join; nếu trùng dòng, cân nhắc query.distinct(true).
 *
 * 4) Hiệu năng:
 *    - lower(field) có thể bỏ index thường → cân nhắc functional index hoặc store lowercase column.
 *
 * 5) An toàn:
 *    - Dùng Criteria API giúp tránh SQL injection (thay vì nối chuỗi).
 *
 * 6) Đặt tên tham số "path":
 *    - Trong method eq/like..., tham số tên 'path' trùng với tên hàm private path(...).
 *      Java phân biệt theo context (biết bạn đang gọi method path(root, pathString)).
 *    - Để rõ ràng hơn, có thể đổi tham số 'path' thành 'property' trong các method public.
 */

