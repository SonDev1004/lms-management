/* ============================================================
   Thêm các cột cần cho ProgramDetail vào bảng course
   ============================================================ */

-- program_id: cho biết course này thuộc về chương trình (program) nào.
--             Giúp truy vấn nhanh tất cả các lớp thuộc một chương trình.
ALTER TABLE course
    ADD program_id BIGINT NULL;

-- curriculum_order: vị trí/thứ tự môn trong lộ trình của chương trình.
--                  Hữu ích để sắp xếp subject trong ProgramDetail theo đúng order.
ALTER TABLE course
    ADD curriculum_order TINYINT NULL;

-- track_code: mã ca học/lộ trình, gom nhóm các course theo cùng khung giờ.
--             Ví dụ: "T246-1830-2000" (Thứ 2-4-6, 18:30–20:00).
--             Giúp phân biệt các track khi một program mở nhiều lớp song song.
ALTER TABLE course
    ADD track_code NVARCHAR(50) NULL;
