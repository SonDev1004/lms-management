package com.lmsservice.common.paging;

// ❖ Package utils chung cho phân trang/sắp xếp (dùng lại cho mọi resource).

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.domain.*;
// ❖ Import Pageable, PageRequest, Sort... từ Spring Data để thao tác paging/sort.

public final class PageableUtils {
    private PageableUtils() {
        // ❖ Class tiện ích (utility class) => private constructor để chặn khởi tạo.
    }

    /**
     * Chỉ cho phép sort theo cột root hợp lệ (whitelist).
     *
     * @param incoming Pageable client gửi lên (chứa page/size/sort)
     * @param allowed  Danh sách "tên thuộc tính" cho phép sắp xếp (ví dụ: id, name, price...)
     * @param fallback Sort fallback sẽ dùng nếu client không gửi sort hợp lệ
     * @return Pageable mới (giữ nguyên page/size) nhưng sort đã được "lọc" theo whitelist
     * <p>
     * Vì sao cần?
     * - Bảo vệ API: không cho client sort theo cột lạ (tránh lỗi runtime/hiệu năng).
     * - Đảm bảo trật tự ổn định (stable) khi fallback.
     * - Hỗ trợ multi-sort (Spring cho phép lặp tham số &sort=...): ta duyệt từng Order và chỉ giữ Order hợp lệ.
     */
    public static Pageable sanitizeSort(Pageable incoming, Set<String> allowed, Sort fallback) {
        if (incoming == null) {
            // fallback có thể null -> về Sort.unsorted() để không NPE
            return PageRequest.of(0, 20, fallback == null ? Sort.unsorted() : fallback);
        }

        Sort sanitized = Sort.unsorted();
        // ❖ sanitized: sort đã "lọc sạch". Khởi tạo ở trạng thái "unsorted" rồi cộng dồn các Order hợp lệ.

        for (Sort.Order o : incoming.getSort())
            // ❖ Duyệt TỪNG điều kiện sắp xếp mà client gửi (có thể có nhiều sort).
            if (allowed.contains(o.getProperty())) sanitized = sanitized.and(Sort.by(o));
        // ❖ Nếu property nằm trong whitelist => giữ lại bằng cách "and" thêm Order đó.
        //    - .and(...) cho phép chain nhiều Order theo thứ tự client gửi.
        //    - Nếu không nằm trong whitelist => bỏ qua (không thêm).

        if (sanitized.isUnsorted()) sanitized = fallback;
        // ❖ Nếu sau khi lọc, không còn Order hợp lệ nào => dùng sort fallback an toàn (ví dụ: id DESC).
        //    - Tránh trả về "unsorted" vì sẽ tạo thứ tự không ổn định giữa các request.

        return PageRequest.of(incoming.getPageNumber(), incoming.getPageSize(), sanitized);
        // ❖ Trả về Pageable MỚI:
        //    - Giữ nguyên pageNumber (0-based) + pageSize của client
        //    - Thay sort bằng "sanitized" (đã lọc)
        // Lưu ý: nếu incoming là "unpaged", getPageNumber/getPageSize có thể không như kỳ vọng.
        // Thực tế trong controller ta luôn nhận Pageable có page/size, nên an toàn.
    }

    /**
     * Cho phép sort alias -> nested path (ví dụ: brandName -> brand.name).
     *
     * @param incoming    Pageable client gửi lên
     * @param aliasToPath Map alias -> đường dẫn thuộc tính thực tế (có thể là nested, ví dụ: "brand.name")
     * @param fallback    Sort fallback nếu map không tạo được Order hợp lệ nào
     * @return Pageable mới với sort đã được ánh xạ & lọc
     * <p>
     * Khi nào dùng?
     * - Khi KHÔNG muốn cho client biết cấu trúc entity (nested path), nhưng vẫn cho phép sort:
     * client gọi sort=brandName,asc -> hệ thống map ngầm sang "brand.name".
     * - Tránh lộ mô hình domain, giảm coupling giữa client & DB schema.
     */
    public static Pageable sanitizeSortWithMapping(Pageable incoming, Map<String, String> aliasToPath, Sort fallback) {
        if (incoming == null) return PageRequest.of(0, 20, fallback);
        // ❖ Nếu không có Pageable, áp page=0,size=20,sort=fallback như trên.

        Sort sanitized = Sort.unsorted();
        // ❖ Sort kết quả sau khi ánh xạ từng alias -> real path.

        for (Sort.Order o : incoming.getSort()) {
            // ❖ Duyệt từng Order client gửi (multi-sort vẫn hỗ trợ).
            String real = aliasToPath.get(o.getProperty());
            // ❖ Lấy "đường dẫn thật" (có thể là nested) tương ứng alias client yêu cầu.

            if (real != null && !real.isBlank())
                sanitized = sanitized.and(Sort.by(new Sort.Order(o.getDirection(), real)));
            // ❖ Nếu alias hợp lệ (có mapping):
            //    - Tạo Order mới với "real path" nhưng giữ nguyên hướng (ASC/DESC) từ client.
            //    - GỘP (and) vào Sort kết quả theo đúng thứ tự client gửi.
            //
            // Lưu ý:
            // - Ở đây ta chỉ copy "direction". Nếu bạn dùng thêm NullHandling/IgnoreCase trong Order,
            //   có thể copy các thuộc tính đó tuỳ nhu cầu (.with(...)).
        }

        if (sanitized.isUnsorted()) sanitized = fallback;
        // ❖ Không có alias hợp lệ nào => dùng fallback sort để đảm bảo thứ tự ổn định.

        return PageRequest.of(incoming.getPageNumber(), incoming.getPageSize(), sanitized);
        // ❖ Trả Pageable mới (giữ page/size gốc, thay sort đã ánh xạ).
        //
        // Cảnh báo nhỏ:
        // - Sort theo nested path có thể khiến JPA sinh join; đa số case to-one OK.
        // - Với to-many/nested phức tạp, cân nhắc thiết kế lại hoặc thêm spec orderBy tùy chỉnh.
    }

    // ✅ Helper tạo whitelist nhanh, giữ thứ tự khai báo (phục vụ multi-sort)
    public static Set<String> toWhitelist(String... props) {
        // LinkedHashSet để:
        // - Giữ nguyên thứ tự bạn truyền vào (ví dụ "title" rồi "id")
        // - Tự loại bỏ trùng lặp nếu có
        return Arrays.stream(props).collect(Collectors.toCollection(LinkedHashSet::new));
    }
}
