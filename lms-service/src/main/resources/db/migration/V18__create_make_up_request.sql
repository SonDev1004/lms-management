CREATE TABLE make_up_request (
                                 id BIGINT IDENTITY(1,1) PRIMARY KEY,
                                 student_id BIGINT NOT NULL,
                                 session_id BIGINT NOT NULL,
                                 course_id BIGINT NOT NULL,
                                 reason NVARCHAR(1000) NULL,
                                 status VARCHAR(20) NOT NULL,
                                 created_at DATETIME2 NOT NULL,
                                 processed_by_id BIGINT NULL,
                                 processed_at DATETIME2 NULL,
                                 admin_note NVARCHAR(1000) NULL
);

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_makeup_student
        FOREIGN KEY (student_id) REFERENCES [user](id);

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_makeup_session
        FOREIGN KEY (session_id) REFERENCES session(id);

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_makeup_course
        FOREIGN KEY (course_id) REFERENCES course(id);

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_makeup_processed_by
        FOREIGN KEY (processed_by_id) REFERENCES [user](id);
