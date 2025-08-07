ALTER TABLE curriculum
    ADD CONSTRAINT uq_program_subject UNIQUE (program_id, subject_id);
