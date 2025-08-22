/* 1) Cho phép teacher_id = NULL (course Pending có thể chưa chốt GV) */
IF EXISTS (SELECT 1 FROM sys.columns
           WHERE object_id = OBJECT_ID('dbo.course') AND name = 'teacher_id')
BEGIN
ALTER TABLE dbo.course ALTER COLUMN teacher_id bigint NULL;
END
GO

/* 2) Đổi tên quantity -> capacity (nếu còn cột quantity) */
IF COL_LENGTH('dbo.course', 'capacity') IS NULL
BEGIN
    IF COL_LENGTH('dbo.course', 'quantity') IS NOT NULL
        EXEC sp_rename 'dbo.course.quantity', 'capacity', 'COLUMN';
ELSE
ALTER TABLE dbo.course ADD capacity int NULL;  -- fallback nếu db mới không có quantity
END
GO

/* 3) Thêm code (đồng bộ kiểu với program/subject: char(36)) */
IF COL_LENGTH('dbo.course', 'code') IS NULL
ALTER TABLE dbo.course ADD code char(36) NULL;
GO

/* 4) Thêm start_date (ngày khai giảng) */
IF COL_LENGTH('dbo.course', 'start_date') IS NULL
ALTER TABLE dbo.course ADD start_date date NULL;
GO

/* 5) Thêm planned_session (số buổi dự kiến của course) */
IF COL_LENGTH('dbo.course', 'planned_session') IS NULL
ALTER TABLE dbo.course ADD planned_session tinyint NULL;
GO

/* 6) Ràng buộc dữ liệu cơ bản (idempotent) */

/* planned_session > 0 nếu có giá trị */
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_course_planned_session_pos')
BEGIN
ALTER TABLE dbo.course
    ADD CONSTRAINT CK_course_planned_session_pos
        CHECK (planned_session IS NULL OR planned_session > 0);
END
GO

/* status 0..5 (Draft/Pending/Available/Ongoing/Completed/Cancelled) nếu bạn đã theo dải này */
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_course_status_0_5')
BEGIN
ALTER TABLE dbo.course
    ADD CONSTRAINT CK_course_status_0_5 CHECK (status BETWEEN 0 AND 5);
END
GO

/* code là duy nhất nếu có (unique filtered index) */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_course_code' AND object_id = OBJECT_ID('dbo.course'))
CREATE UNIQUE INDEX UX_course_code ON dbo.course(code) WHERE code IS NOT NULL;
GO

/* index cho start_date để lọc theo sắp khai giảng / đang mở tuyển sinh */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_course_start_date' AND object_id = OBJECT_ID('dbo.course'))
CREATE INDEX IX_course_start_date ON dbo.course(start_date);
GO
