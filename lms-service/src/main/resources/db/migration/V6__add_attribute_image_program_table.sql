-- Thêm cột image_url, NOT NULL và mặc định chuỗi rỗng
ALTER TABLE dbo.program
    ADD image_url nvarchar(512) NOT NULL
    CONSTRAINT DF_program_image_url DEFAULT ('')
    WITH VALUES;  -- fill '' cho các dòng đã có
GO
