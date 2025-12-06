CREATE TABLE assignment_retake_request (
                                           id              BIGINT IDENTITY PRIMARY KEY,
                                           student_id      BIGINT      NOT NULL,
                                           assignment_id   BIGINT      NOT NULL,
                                           status          VARCHAR(20) NOT NULL,   -- PENDING, APPROVED, REJECTED
                                           reason          NVARCHAR(500) NULL,
                                           admin_note      NVARCHAR(500) NULL,
                                           approved_by     BIGINT NULL,            -- user id của TEACHER/AM duyệt
                                           retake_deadline DATETIME2 NULL,         -- cho thi lại tới khi nào
                                           created_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
                                           updated_at      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

                                           CONSTRAINT fk_ret_student FOREIGN KEY (student_id) REFERENCES student(id),
                                           CONSTRAINT fk_ret_assignment FOREIGN KEY (assignment_id) REFERENCES assignment(id)
);
