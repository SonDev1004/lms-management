package com.lmsservice.config;

// ❖ Khai báo package. Đặt dưới common/paging/config để gom các cấu hình paging dùng chung cho toàn app.

/*
 * Các import cần thiết cho cấu hình Spring và tuỳ biến cơ chế bind Pageable từ query params.
 */
import org.springframework.context.annotation.*;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;
// ❖ Interface functional (SAM) cho phép "tuỳ biến" đối tượng PageableHandlerMethodArgumentResolver
//   - Resolver này là thành phần Spring MVC dùng để bind tham số Pageable/Slice từ HTTP request vào method controller.
//   - Ta cung cấp 1 bean kiểu này để can thiệp các rule toàn cục: max page size, 0-index/1-index, tên tham số, v.v.

/**
 * Giới hạn size & chuẩn hoá 0-index cho toàn app
 * - Mục tiêu: đặt GATE toàn cục (security/perf) cho paging:
 *   + Không cho client yêu cầu size quá lớn (bảo vệ DB).
 *   + Quy ước page đếm từ 0 (0-index) để đồng nhất với Page.getNumber() của Spring Data.
 */
@Configuration
// ❖ Đánh dấu class này là một "Configuration class" — Spring sẽ quét và đăng ký các bean định nghĩa bên trong.
public class PageableConfig {

    @Bean
    // ❖ Đăng ký 1 bean kiểu PageableHandlerMethodArgumentResolverCustomizer trong ApplicationContext.
    //   Khi Spring MVC khởi tạo resolver cho Pageable, bean này sẽ được gọi để áp các cấu hình toàn cục.
    public PageableHandlerMethodArgumentResolverCustomizer customizePageable() {

        // ❖ Trả về một lambda nhận tham số 'r' (resolver) để set các rule.
        //   Tham số 'r' chính là PageableHandlerMethodArgumentResolver mà Spring sử dụng khi bind Pageable.
        return r -> {
            r.setMaxPageSize(200);
            // ❖ Ý nghĩa: giới hạn KÍCH THƯỚC TRANG tối đa mà client có thể yêu cầu (size<=200).
            //   - Nếu client gửi size > 200, Spring sẽ clamp/giới hạn về 200.
            //   - Lợi ích: bảo vệ hệ thống trước các request cố tình lấy quá nhiều bản ghi 1 lúc.
            //   - Tuỳ dự án, bạn có thể chỉnh con số này (VD: 100, 500) theo nhu cầu và khả năng DB.

            r.setOneIndexedParameters(true);
            // ❖ Ý nghĩa: chọn chế độ ĐÁNH SỐ TRANG 0-INDEX hay 1-INDEX khi đọc tham số từ HTTP.
            //   - false  => 0-index: page=0 là trang đầu tiên (PHÙ HỢP với Page.getNumber() của Spring Data).
            //   - true   => 1-index: page=1 là trang đầu tiên (dễ đọc hơn với người dùng, nhưng lệch với
            // Page.getNumber()).
            //   Vì sao để false?
            //   - Đồng nhất với hành vi mặc định của Spring Data (Page#getNumber() là 0-based).
            //   - Tránh phải cộng/trừ 1 khi map dữ liệu vào PageResponse.
        };
    }
}

/*
 * GỢI Ý MỞ RỘNG (nếu cần, thêm các dòng này trong lambda):
 * ------------------------------------------------------
 * r.setPageParameterName("page");      // Đổi tên tham số page (mặc định là "page")
 * r.setSizeParameterName("size");      // Đổi tên tham số size (mặc định là "size")
 * r.setFallbackPageable(PageRequest.of(0, 20)); // Đặt pageable mặc định khi không có tham số (vd size mặc định 20)
 * r.setQualifierDelimiter("_");        // Dùng khi 1 controller có nhiều Pageable (qualifier), ví dụ: ?users_page=0&orders_page=1
 *
 * VỀ MULTI-SORT:
 * - Spring hỗ trợ multi-sort bằng cách LẶP tham số 'sort':
 *     ?sort=price,desc&sort=id,asc
 * - KHÔNG dùng "sort=price,desc;id,asc" (dấu ';' không phải cú pháp chuẩn của Spring).
 * - Kết hợp với whitelist trong PageableUtils để khoá các cột cho phép sort.
 */
