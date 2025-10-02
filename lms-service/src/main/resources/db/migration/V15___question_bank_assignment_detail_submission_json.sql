/* =====================================================================
   V20251002__question_bank_assignment_detail_submission_json.sql
   Mục tiêu:
   - Tạo question_bank (ngân hàng câu hỏi, JSON đáp án)
   - Tạo assignment_detail (map câu hỏi vào đề + snapshot JSON)
   - Bổ sung cột JSON & trạng thái chấm cho submission
   - Thêm CHECK/INDEX cần thiết
   ===================================================================== */

------------------------------------------------------------
-- 1) QUESTION_BANK: Ngân hàng câu hỏi
------------------------------------------------------------
CREATE TABLE dbo.question_bank (
                                   id           BIGINT IDENTITY(1,1)       NOT NULL PRIMARY KEY, -- ID tự tăng
                                   type         TINYINT                    NOT NULL,             -- Loại câu hỏi: 1=MCQ 1 đáp án, 2=MCQ nhiều đáp án,
    -- 3=Fill-blank, 4=Listening MCQ, 5=Listening Fill-blank,
    -- 6=Essay
                                   content      NVARCHAR(MAX)              NOT NULL,             -- Nội dung câu hỏi (text chính)
                                   options_json NVARCHAR(MAX)              NULL,                 -- Danh sách option (cho MCQ) lưu JSON
                                   answers_json NVARCHAR(MAX)              NULL,                 -- Đáp án chuẩn (JSON) cho auto-grade
                                   audio_url    NVARCHAR(512)              NULL,                 -- Link file audio (cho Listening)
                                   subject_id   BIGINT                     NULL
                  REFERENCES dbo.subject(id),                    -- Liên kết môn học
                                   visibility   TINYINT                    NOT NULL
                                       CONSTRAINT DF_qb_visibility DEFAULT (1),       -- 0=private, 1=shared trong ngân hàng
                                   is_active    BIT                        NOT NULL
                                       CONSTRAINT DF_qb_is_active DEFAULT (1),        -- 1=đang dùng, 0=ẩn
                                   created_by   BIGINT                     NOT NULL
                                       REFERENCES dbo.[user](id),                     -- Người tạo câu hỏi
                                   created_at   DATETIME2(6)               NOT NULL
                  CONSTRAINT DF_qb_created_at DEFAULT (SYSUTCDATETIME()) -- Thời gian tạo
);
GO

ALTER TABLE dbo.question_bank
    ADD CONSTRAINT CK_qb_type       CHECK (type BETWEEN 1 AND 6),
      CONSTRAINT CK_qb_visibility CHECK (visibility IN (0,1)),
      CONSTRAINT CK_qb_optjson    CHECK (options_json IS NULL OR ISJSON(options_json) = 1),
      CONSTRAINT CK_qb_ansjson    CHECK (answers_json IS NULL OR ISJSON(answers_json) = 1);
GO

CREATE INDEX IX_qb_subject_type_active
    ON dbo.question_bank(subject_id, type, is_active); -- Tăng tốc filter theo môn/loại/active
GO


------------------------------------------------------------
-- 2) ASSIGNMENT_DETAIL: ánh xạ câu hỏi vào assignment (đề)
------------------------------------------------------------
CREATE TABLE dbo.assignment_detail (
                                       id                     BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- ID
                                       assignment_id          BIGINT                NOT NULL
                                           REFERENCES dbo.assignment(id) ON DELETE CASCADE, -- Đề thi/bài tập
                                       question_id            BIGINT                NOT NULL
                                           REFERENCES dbo.question_bank(id),                -- Câu hỏi trong ngân hàng
    [order]                SMALLINT              NOT NULL
                                       CONSTRAINT DF_ad_order DEFAULT (1),              -- Thứ tự câu trong đề
    points                 DECIMAL(5,2)          NOT NULL
        CONSTRAINT DF_ad_points DEFAULT (1.00),          -- Điểm số cho câu hỏi
    question_snapshot_json NVARCHAR(MAX)         NULL                          -- Snapshot câu hỏi tại thời điểm publish,
-- đảm bảo đề ổn định dù question_bank bị sửa
    );
GO

ALTER TABLE dbo.assignment_detail
    ADD CONSTRAINT UQ_ad_assignment_question UNIQUE (assignment_id, question_id),
      CONSTRAINT CK_ad_snapshot_json CHECK (question_snapshot_json IS NULL OR ISJSON(question_snapshot_json) = 1);
GO

CREATE INDEX IX_ad_assignment_order
    ON dbo.assignment_detail(assignment_id, [order]); -- Tăng tốc truy vấn đề -> câu theo thứ tự
GO


------------------------------------------------------------
-- 3) SUBMISSION: bổ sung cột JSON & trạng thái chấm
--    (score hiện tại = điểm cuối cùng hiển thị)
------------------------------------------------------------
ALTER TABLE dbo.submission
    ADD answers_json  NVARCHAR(MAX) NULL,                                   -- Câu trả lời của HS dạng JSON
      auto_score    DECIMAL(5,2)  NOT NULL CONSTRAINT DF_submission_auto DEFAULT (0), -- Điểm máy chấm
      graded_status TINYINT       NOT NULL CONSTRAINT DF_submission_graded DEFAULT (0), -- 0=chưa chấm, 1=auto_done, 2=teacher_reviewed
      started_at    DATETIME2(6)  NULL,                                   -- Thời điểm bắt đầu làm
      finished_at   DATETIME2(6)  NULL;                                   -- Thời điểm nộp
GO

ALTER TABLE dbo.submission
    ADD CONSTRAINT CK_submission_answers_json CHECK (answers_json IS NULL OR ISJSON(answers_json) = 1);
GO

-- Index phục vụ truy vấn bài nộp theo assignment & student
CREATE INDEX IX_submission_assignment_student
    ON dbo.submission(assignment_id, student_id);
GO

/* ---------------------------------------------------------------------
   Ghi chú:
   - question_bank: nơi quản lý toàn bộ câu hỏi (multi-type), hỗ trợ JSON cho đáp án/option
   - assignment_detail: ánh xạ câu hỏi vào đề, giữ điểm/thứ tự + snapshot để không bị thay đổi
   - submission: ghi nhận bài nộp, lưu câu trả lời JSON, điểm auto, trạng thái chấm, thời gian làm
   --------------------------------------------------------------------- */
