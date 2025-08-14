package com.lmsservice.common.paging;

// ❖ Khai báo package chứa lớp PageResponse.
//   Lưu ý: convention thường dùng "com.filtertemplate..." thay vì "filtertemplate.com..."
//   nhưng đây không ảnh hưởng chức năng. Đảm bảo package khớp với cấu trúc thư mục.

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * PageResponse<T> là DTO chuẩn hoá JSON trả về cho các API có phân trang.
 * - Tránh trả thẳng Page<T> ra ngoài (gắn chặt framework, khó đổi format).
 * - Dễ kiểm soát contract: tên trường, kiểu dữ liệu, có thể thêm field khác sau này mà không ảnh hưởng core.
 */
@Getter // ❖ Lombok sinh getter cho tất cả field (page, size, totalItems, ...)
@Setter // ❖ Lombok sinh setter cho tất cả field => DTO này MUTABLE (cho phép chỉnh sửa sau khi tạo).
@NoArgsConstructor // ❖ Lombok sinh constructor rỗng: PageResponse() — hữu ích khi (de)serialize hoặc set từng field.
@AllArgsConstructor // ❖ Lombok sinh constructor đầy đủ tham số theo đúng thứ tự các field bên dưới.
@FieldDefaults(level = AccessLevel.PRIVATE)
// ❖ Tất cả field bên trong class sẽ mặc định là private (giấu thông tin, truy cập qua getter/setter).
public class PageResponse<T> {
    // ❖ <T> là generic type cho "kiểu phần tử" trong items (ví dụ Product, UserDTO, ...).
    //   Cho phép tái sử dụng PageResponse cho mọi loại dữ liệu.

    int page;
    // ❖ Số thứ tự của trang hiện tại (0-based).
    //   Lưu ý: Spring Data Page.getNumber() cũng là 0-based.

    int size;
    // ❖ Số phần tử mỗi trang (page size) mà backend trả về thực tế (có thể <= yêu cầu nếu hết dữ liệu).

    long totalItems;
    // ❖ Tổng số phần tử (tất cả trang) — Spring Data tính dựa trên count(*).
    //   Có thể tốn chi phí với bảng rất lớn; nếu cần tiết kiệm có thể dùng Slice thay Page.

    int totalPages;
    // ❖ Tổng số trang = ceil(totalItems / size).
    //   Giúp client biết khi nào dừng.

    boolean hasNext;
    // ❖ Có trang tiếp theo hay không (page.hasNext()).

    boolean hasPrevious;
    // ❖ Có trang trước hay không (page.hasPrevious()).

    List<T> items;
    // ❖ Danh sách phần tử của trang hiện tại — chính là page.getContent().
    //   Tuỳ ý: bạn có thể để T là DTO (không phải entity) để tránh lộ field nhạy cảm.

    /**
     * Factory method chuyển từ Page<U> (của Spring Data) sang PageResponse<U> (contract JSON của bạn).
     * Vì sao dùng <U> thay vì <T>?
     * - Đây là static method, không phụ thuộc vào T của class.
     * - <U> cho phép linh hoạt: tuỳ lần gọi bạn map Page<ProductDTO> hoặc Page<OrderDTO> đều được.
     */
    public static <U> PageResponse<U> from(Page<U> page) {
        // ❖ Nhận tham số: page — đối tượng Page<U> mà repository/controller trả về từ JPA.
        // ❖ Trả về: PageResponse<U> — DTO đã chuẩn hoá để xuất JSON.

        return new PageResponse<>(
                page.getNumber() +1, // ❖ Lấy chỉ số trang hiện tại (0-based).
                page.getSize(), // ❖ Số phần tử trên trang hiện tại (kích thước trang).
                page.getTotalElements(), // ❖ Tổng số phần tử (count(*)) cho toàn bộ tập dữ liệu.
                page.getTotalPages(), // ❖ Tổng số trang.
                page.hasNext(), // ❖ true nếu còn trang sau.
                page.hasPrevious(), // ❖ true nếu có trang trước.
                page.getContent() // ❖ List<U> — nội dung trang hiện tại.
                );
    }
}
