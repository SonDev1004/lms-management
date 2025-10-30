-- ==========================================
-- Thêm cột scheduled_date cho bảng notification (SQL Server)
-- ==========================================

-- Thêm cột nếu chưa tồn tại
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'scheduled_date'
      AND Object_ID = Object_ID(N'dbo.notification')
)
BEGIN
ALTER TABLE dbo.notification
    ADD scheduled_date DATETIME2 NULL;
END

IF EXISTS (
    SELECT 1 FROM sys.columns
    WHERE Name = N'posted_date'
      AND Object_ID = Object_ID(N'dbo.notification')
)
BEGIN
ALTER TABLE dbo.notification
ALTER COLUMN posted_date DATETIME2 NULL;
END
