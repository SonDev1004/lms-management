package com.lmsservice.common.paging;

/*
 * ❖ Utils chung cho phân trang/sắp xếp (tái dùng cho mọi resource).
 *    - Mục tiêu: AN TOÀN & THÂN THIỆN (lenient)
 *      + Paging: tự "clamp" các giá trị xấu (page âm, size ≤ 0, size quá lớn)
 *      + Sort: chỉ giữ các field nằm trong whitelist (hoặc alias mapping), nếu không hợp lệ -> dùng fallback
 *    - Lợi ích:
 *      + Bảo vệ API khỏi input bậy nhưng vẫn trả dữ liệu hợp lệ (UX mượt)
 *      + Thứ tự ổn định khi fallback, paging chính xác
 */

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;

public final class PageableUtils {
    private PageableUtils() {}

    // ====== Chính sách clamp mặc định (có thể chỉnh tuỳ dự án) ======
    private static final int DEFAULT_PAGE = 0; // Spring Pageable: 0-based
    private static final int DEFAULT_SIZE = 20; // size mặc định khi client không gửi/ gửi ≤ 0
    private static final int MAX_SIZE = 100; // chặn size quá lớn

    /**
     * ❖ Sanitize sort theo danh sách property "root" cho phép (whitelist) + clamp page/size.
     *
     * @param incoming Pageable client gửi lên (có page/size/sort). Có thể null.
     * @param allowed  Tập thuộc tính cho phép sort, ví dụ: ["id","title","fee",...]
     * @param fallback Sort fallback sẽ dùng nếu sau khi lọc không còn Order hợp lệ.
     * @return Pageable mới:
     *         - page/size đã được clamp về biên an toàn
     *         - sort đã được "lọc sạch" theo whitelist (hoặc fallback)
     *
     * Vì sao cần?
     * - Tránh lỗi runtime do client sort theo cột không tồn tại.
     * - Đảm bảo thứ tự ổn định khi fallback (vd: id DESC).
     * - UX tốt: input xấu không làm vỡ API; hệ thống tự điều chỉnh về giá trị an toàn.
     */
    public static Pageable sanitizeSort(Pageable incoming, Set<String> allowed, Sort fallback) {
        // 1) Clamp page & size
        final int page = clampPage(incoming);
        final int size = clampSize(incoming);

        // 2) Lọc sort theo whitelist
        Sort sanitized = Sort.unsorted();
        if (incoming != null && incoming.getSort() != null) {
            for (Sort.Order o : incoming.getSort()) {
                if (allowed.contains(o.getProperty())) {
                    // giữ nguyên hướng (ASC/DESC), nullHandling/ignoreCase nếu có
                    Sort.Order kept = copyOrder(o);
                    sanitized = sanitized.and(Sort.by(kept));
                }
            }
        }

        // 3) Nếu không còn sort hợp lệ -> fallback (nếu fallback null -> unsorted)
        if (sanitized.isUnsorted()) {
            sanitized = (fallback == null ? Sort.unsorted() : fallback);
        }

        return PageRequest.of(page, size, sanitized);
    }

    /**
     * ❖ Sanitize sort theo "alias mapping" -> nested path + clamp page/size.
     *    Ví dụ: client sort=brandName,asc -> map ngầm sang "brand.name".
     *
     * @param incoming    Pageable client gửi lên (có thể null)
     * @param aliasToPath Map <alias, realPath> , ví dụ: {"brandName" -> "brand.name"}
     * @param fallback    Sort fallback nếu không có alias hợp lệ
     * @return Pageable đã clamp page/size + sort đã được ánh xạ & lọc
     *
     * Khi nào dùng?
     * - Khi KHÔNG muốn để lộ cấu trúc entity/nested path ra client nhưng vẫn hỗ trợ sort thân thiện.
     */
    public static Pageable sanitizeSortWithMapping(Pageable incoming, Map<String, String> aliasToPath, Sort fallback) {
        // 1) Clamp page & size
        final int page = clampPage(incoming);
        final int size = clampSize(incoming);

        // 2) Lọc & ánh xạ sort alias -> real path
        Sort sanitized = Sort.unsorted();
        if (incoming != null && incoming.getSort() != null) {
            for (Sort.Order o : incoming.getSort()) {
                String real = aliasToPath.get(o.getProperty());
                if (real != null && !real.isBlank()) {
                    Sort.Order mapped = new Sort.Order(o.getDirection(), real);
                    // giữ thuộc tính phụ của Order nếu có
                    if (o.isIgnoreCase()) mapped = mapped.ignoreCase();
                    switch (o.getNullHandling()) {
                        case NULLS_FIRST -> mapped = mapped.nullsFirst();
                        case NULLS_LAST -> mapped = mapped.nullsLast();
                        case NATIVE -> {} // giữ nguyên
                    }
                    sanitized = sanitized.and(Sort.by(mapped));
                }
            }
        }

        // 3) Fallback khi không có alias hợp lệ
        if (sanitized.isUnsorted()) {
            sanitized = (fallback == null ? Sort.unsorted() : fallback);
        }

        return PageRequest.of(page, size, sanitized);
    }

    /**
     * ❖ Helper tạo whitelist nhanh (giữ thứ tự bạn truyền vào, tự loại trùng).
     *    Phục vụ multi-sort: thứ tự phần tử trong whitelist KHÔNG ép thứ tự sort
     *    (thứ tự sort vẫn theo client), chỉ là tiện lợi khi build set.
     */
    public static Set<String> toWhitelist(String... props) {
        return Arrays.stream(props).collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // ====================== Private helpers ======================

    // Copy Order để không mất ignoreCase/nullHandling khi lọc
    private static Sort.Order copyOrder(Sort.Order o) {
        Sort.Order kept = new Sort.Order(o.getDirection(), o.getProperty());
        if (o.isIgnoreCase()) kept = kept.ignoreCase();
        switch (o.getNullHandling()) {
            case NULLS_FIRST -> kept = kept.nullsFirst();
            case NULLS_LAST -> kept = kept.nullsLast();
            case NATIVE -> {} // giữ nguyên
        }
        return kept;
    }

    // Ép page >= 0; incoming null -> DEFAULT_PAGE
    private static int clampPage(Pageable incoming) {
        if (incoming == null) return DEFAULT_PAGE;
        return Math.max(0, incoming.getPageNumber());
    }

    // Ép size: size <= 0 -> DEFAULT_SIZE; size quá lớn -> MAX_SIZE; incoming null -> DEFAULT_SIZE
    private static int clampSize(Pageable incoming) {
        if (incoming == null) return DEFAULT_SIZE;
        int size = incoming.getPageSize();
        if (size <= 0) return DEFAULT_SIZE;
        return Math.min(size, MAX_SIZE);
    }
}
