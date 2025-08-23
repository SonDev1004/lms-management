-- ==========================================================
-- Bảng: course_timeslot
-- Mục đích:
--   - Lưu các khung giờ cố định theo thứ trong tuần của một course.
--   - Từ đây hệ thống generate ra các session theo lịch tuần.
-- Ghi chú:
--   - 1 = Mon, ... 7 = Sun (SET DATEFIRST 1 khi cần tính toán).
--   - room_id cho phép NULL; nhưng khi generate session, room_id ở session là NOT NULL,
--     nên khuyến nghị điền room ở timeslot hoặc có cơ chế fallback khác.
-- ==========================================================

IF OBJECT_ID('dbo.course_timeslot','U') IS NULL
BEGIN
CREATE TABLE dbo.course_timeslot (
                                     id          BIGINT IDENTITY(1,1) PRIMARY KEY,         -- Khóa chính
                                     course_id   BIGINT  NOT NULL
                                         CONSTRAINT FK_ct_course REFERENCES dbo.course(id), -- FK course
                                     day_of_week TINYINT NOT NULL,                         -- 1..7
                                     start_time  TIME    NOT NULL,                         -- giờ bắt đầu
                                     end_time    TIME    NOT NULL,                         -- giờ kết thúc
                                     room_id     BIGINT  NULL
          CONSTRAINT FK_ct_room REFERENCES dbo.room(id),     -- phòng mặc định (nếu có)
                                     is_active   BIT     NOT NULL CONSTRAINT DF_ct_active DEFAULT 1, -- còn hiệu lực?
                                     note        NVARCHAR(255) NULL                         -- ghi chú
);
END
GO

-- RÀNG BUỘC NGHIỆP VỤ
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_ct_dow')
ALTER TABLE dbo.course_timeslot
    ADD CONSTRAINT CK_ct_dow  CHECK (day_of_week BETWEEN 1 AND 7);
GO
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_ct_time')
ALTER TABLE dbo.course_timeslot
    ADD CONSTRAINT CK_ct_time CHECK (start_time < end_time);
GO

-- Unique: chỉ cho phép 1 SLOT "đang active" cùng (course, day, start, end)
-- => vẫn lưu được slot cũ is_active=0 để giữ lịch sử.
IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name='UX_ct_course_dow_timerange_active' AND object_id=OBJECT_ID('dbo.course_timeslot')
)
CREATE UNIQUE INDEX UX_ct_course_dow_timerange_active
    ON dbo.course_timeslot(course_id, day_of_week, start_time, end_time)
    WHERE is_active = 1;
GO

-- Index phục vụ truy vấn phổ biến: lấy slot active theo course/day/time
IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name='IX_ct_course_active_dow' AND object_id=OBJECT_ID('dbo.course_timeslot')
)
CREATE INDEX IX_ct_course_active_dow
    ON dbo.course_timeslot(course_id, is_active, day_of_week, start_time);
GO

-- Trigger chặn các slot active bị "đè giờ" (overlap) trong cùng course & cùng day_of_week
-- (CHECK/UNIQUE không phát hiện overlap dạng 18:00-19:00 vs 18:30-20:00)
CREATE OR ALTER TRIGGER dbo.trg_ct_no_overlap
ON dbo.course_timeslot
AFTER INSERT, UPDATE
                                  AS
BEGIN
  SET NOCOUNT ON;

  -- 1) Validate dữ liệu cơ bản
  IF EXISTS (
    SELECT 1
    FROM inserted i
    WHERE i.day_of_week NOT BETWEEN 1 AND 7
       OR i.start_time >= i.end_time
  )
BEGIN
    RAISERROR('Invalid timeslot: day_of_week hoặc time range không hợp lệ.',16,1);
ROLLBACK TRANSACTION; RETURN;
END;

  -- 2) Overlap giữa INSERTED và các slot ACTIVE khác (cùng course, cùng day)
  IF EXISTS (
    SELECT 1
    FROM inserted i
    JOIN dbo.course_timeslot t
      ON  t.course_id   = i.course_id
      AND t.day_of_week = i.day_of_week
      AND t.id         <> i.id
      AND t.is_active   = 1
      AND i.is_active   = 1
      -- điều kiện overlap: startA < endB AND endA > startB
      AND i.start_time <  t.end_time
      AND i.end_time   >  t.start_time
  )
BEGIN
    RAISERROR('Timeslot bị chồng giờ với slot ACTIVE khác của cùng course/day.',16,1);
ROLLBACK TRANSACTION; RETURN;
END;

  -- 3) Overlap nội bộ trong lô INSERTED (multi-row)
  IF EXISTS (
    SELECT 1
    FROM inserted a
    JOIN inserted b
      ON  a.course_id   = b.course_id
      AND a.day_of_week = b.day_of_week
      AND a.id         <> b.id
      AND a.is_active   = 1
      AND b.is_active   = 1
      AND a.start_time <  b.end_time
      AND a.end_time   >  b.start_time
  )
BEGIN
    RAISERROR('Các timeslot mới chèn/đổi bị chồng giờ lẫn nhau.',16,1);
ROLLBACK TRANSACTION; RETURN;
END;
END
GO
