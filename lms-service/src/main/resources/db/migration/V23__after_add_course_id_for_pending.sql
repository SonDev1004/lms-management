-- SQL Server (Flyway)
IF COL_LENGTH('dbo.pending_enrollment', 'course_id') IS NULL
BEGIN
ALTER TABLE dbo.pending_enrollment
    ADD course_id BIGINT NULL;
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = 'fk_pending_enrollment_course'
)
BEGIN
ALTER TABLE dbo.pending_enrollment
    WITH CHECK
    ADD CONSTRAINT fk_pending_enrollment_course
    FOREIGN KEY (course_id) REFERENCES dbo.course(id);
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_pending_enrollment_course_id'
      AND object_id = OBJECT_ID('dbo.pending_enrollment')
)
BEGIN
CREATE INDEX IX_pending_enrollment_course_id
    ON dbo.pending_enrollment(course_id);
END;
