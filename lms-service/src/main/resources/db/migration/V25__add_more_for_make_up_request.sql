
ALTER TABLE make_up_request
    ADD preferred_session_id BIGINT NULL,
    approved_session_id  BIGINT NULL,
    approved_course_id   BIGINT NULL,
    scheduled_at         DATETIME2 NULL,
    attended_at          DATETIME2 NULL;

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_mur_preferred_session
        FOREIGN KEY (preferred_session_id) REFERENCES session(id);

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_mur_approved_session
        FOREIGN KEY (approved_session_id) REFERENCES session(id);

ALTER TABLE make_up_request
    ADD CONSTRAINT fk_mur_approved_course
        FOREIGN KEY (approved_course_id) REFERENCES course(id);

CREATE UNIQUE INDEX ux_mur_student_originalSession
    ON make_up_request(student_id, session_id);
