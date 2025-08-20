-- V10__alter_session_add_timeslot_and_status.sql

-- Thêm cột timeslot_id (nullable)
IF COL_LENGTH('dbo.session','timeslot_id') IS NULL
ALTER TABLE dbo.session ADD timeslot_id BIGINT NULL;
--GO  -- (để nguyên nếu bạn đang dùng GO trong các file khác)

-- Thêm cột status (nullable)
IF COL_LENGTH('dbo.session','status') IS NULL
ALTER TABLE dbo.session ADD status TINYINT NULL;
--GO

/* (Tùy chọn) Backfill trạng thái ban đầu để dễ filter:
   - Buổi tương lai -> Planned (1)
   - Buổi đã qua    -> Completed (2)
   Bỏ nếu bạn muốn set bằng code.
*/
-- UPDATE dbo.session
-- SET status = CASE WHEN [date] >= CAST(GETDATE() AS DATE) THEN 1 ELSE 2 END
-- WHERE status IS NULL;
