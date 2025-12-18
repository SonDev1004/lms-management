ALTER TABLE feedback
    ADD created_at datetime2 NOT NULL CONSTRAINT DF_feedback_created_at DEFAULT SYSDATETIME();
