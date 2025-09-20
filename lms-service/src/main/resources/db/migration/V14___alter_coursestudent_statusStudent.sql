/*------------------------------------------------------------------------------
  course_student.status
  0=PENDING, 1=ENROLLED (default), 2=WAITLIST, 3=IN_PROGRESS,
  4=COMPLETED, 5=DROPPED, 6=AUDIT
------------------------------------------------------------------------------*/
SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
BEGIN TRAN;

-- 0) Bảo đảm bảng tồn tại (tuỳ chọn)
IF OBJECT_ID('dbo.course_student','U') IS NULL
    THROW 50000, 'Table dbo.course_student not found.', 1;

-- 1) Thêm cột (dạng NULL trước)
IF NOT EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.course_student')
      AND name = 'status'
)
    EXEC(N'ALTER TABLE dbo.course_student ADD status TINYINT NULL;');

-- 2) Thêm DEFAULT constraint nếu cột chưa có default
IF NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints dc
    JOIN sys.columns c
      ON c.object_id = dc.parent_object_id
     AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.course_student')
      AND c.name = 'status'
)
    EXEC(N'ALTER TABLE dbo.course_student
           ADD CONSTRAINT DF_course_student_status DEFAULT(1) FOR status;');  -- 1=ENROLLED

-- 3) Backfill và đặt NOT NULL (dùng dynamic để tránh lỗi compile-time)
IF EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.course_student')
      AND name = 'status'
)
BEGIN
EXEC(N'UPDATE dbo.course_student SET status = ISNULL(status,1);');
EXEC(N'ALTER TABLE dbo.course_student ALTER COLUMN status TINYINT NOT NULL;');
END

-- 4) CHECK constraint (dynamic SQL để tránh bind sớm)
IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_course_student_status_valid'
      AND parent_object_id = OBJECT_ID('dbo.course_student')
)
    EXEC(N'ALTER TABLE dbo.course_student
           ADD CONSTRAINT CK_course_student_status_valid
           CHECK (status IN (0,1,2,3,4,5,6));');

COMMIT;
PRINT N'✅ course_student.status added/filled/validated.';
END TRY
BEGIN CATCH
IF @@TRANCOUNT > 0 ROLLBACK;
    DECLARE @msg nvarchar(4000)=ERROR_MESSAGE();
    RAISERROR(N'❌ Migration failed: %s',16,1,@msg);
END CATCH;
