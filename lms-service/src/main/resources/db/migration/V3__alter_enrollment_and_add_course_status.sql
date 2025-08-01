-- Cho phép staff_id trong enrollment được NULL
ALTER TABLE enrollment
ALTER COLUMN staff_id BIGINT NULL;

-- Thêm cột status vào bảng course
ALTER TABLE course
    ADD status INT DEFAULT 0 NOT NULL;