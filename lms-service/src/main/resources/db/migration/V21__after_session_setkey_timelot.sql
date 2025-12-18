ALTER TABLE [dbo].[session]
    ADD CONSTRAINT FK_session_timeslot
    FOREIGN KEY (timeslot_id) REFERENCES [dbo].[course_timeslot](id);
