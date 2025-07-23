CREATE TABLE [dbo].[assignment](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [due_date] [datetime2](6) NULL,
    [factor] [int] NULL,
    [file_name] [nvarchar](max) NULL,
    [is_active] [bit] NULL,
    [max_score] [tinyint] NULL,
    [title] [nvarchar](max) NULL,
    [course_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[comment]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[comment](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [content] [nvarchar](255) NULL,
    [is_appropriate] [bit] NULL,
    [posted_date] [datetime2](6) NULL,
    [session_id] [bigint] NULL,
    [user_id] [bigint] NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY]

/****** Object:  Table [dbo].[course]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[course](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [quantity] [int] NULL,
    [title] [nvarchar](max) NULL,
    [staff_id] [bigint] NOT NULL,
    [subject_id] [bigint] NOT NULL,
    [teacher_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[course_student]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[course_student](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [attendance_list] [varchar](255) NULL,
    [average_score] [real] NULL,
    [is_audit] [tinyint] NULL,
    [note] [nvarchar](max) NULL,
    [course_id] [bigint] NOT NULL,
    [student_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[curriculum]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[curriculum](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [order] [tinyint] NULL,
    [program_id] [bigint] NOT NULL,
    [subject_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[enrollment]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[enrollment](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [paid_fee] [decimal](18, 2) NULL,
    [remaining_fee] [decimal](18, 2) NULL,
    [program_id] [bigint] NOT NULL,
    [staff_id] [bigint] NOT NULL,
    [student_id] [bigint] NOT NULL,
    [subject_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[feedback]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[feedback](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [content] [nvarchar](max) NULL,
    [rating] [tinyint] NULL,
    [course_id] [bigint] NOT NULL,
    [student_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[lesson]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[lesson](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [content] [nvarchar](max) NULL,
    [description] [nvarchar](max) NULL,
    [document] [nvarchar](max) NULL,
    [title] [nvarchar](max) NULL,
    [subject_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[log]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[log](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [related_id] [int] NULL,
    [action_date] [datetime2](6) NULL,
    [action_type] [nvarchar](255) NULL,
    [description] [nvarchar](255) NULL,
    [related_new_data] [nvarchar](255) NULL,
    [related_ol_data] [nvarchar](255) NULL,
    [related_table] [nvarchar](255) NULL,
    [user_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[notification]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[notification](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [content] [nvarchar](max) NULL,
    [is_seen] [bit] NULL,
    [posted_date] [datetime2](6) NULL,
    [severity] [tinyint] NULL,
    [url] [nvarchar](max) NULL,
    [notification_type_id] [bigint] NOT NULL,
    [user_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[notification_type]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[notification_type](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [icon] [nvarchar](255) NULL,
    [title] [nvarchar](255) NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[payment_history]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[payment_history](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [payment_date] [datetime2](6) NULL,
    [payment_method] [nvarchar](255) NULL,
    [reference_number] [nvarchar](255) NULL,
    [enrollment_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[permisstion]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[permisstion](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [description] [nvarchar](255) NULL,
    [is_active] [bit] NOT NULL,
    [name] [nvarchar](100) NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[program]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[program](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [code] [char](36) NULL,
    [description] [nvarchar](max) NULL,
    [fee] [decimal](18, 2) NULL,
    [is_active] [bit] NOT NULL,
    [max_student] [tinyint] NULL,
    [min_student] [tinyint] NULL,
    [title] [nvarchar](100) NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[role]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[role](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [description] [nvarchar](100) NULL,
    [name] [nvarchar](100) NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[role_permission]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[role_permission](
    [role_id] [bigint] NOT NULL,
    [permission_id] [bigint] NOT NULL,
     PRIMARY KEY CLUSTERED
    (
    [role_id] ASC,
[permission_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[room]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[room](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [capacity] [tinyint] NULL,
    [is_available] [bit] NOT NULL,
    [location] [nvarchar](max) NULL,
    [room_name] [nvarchar](max) NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[session]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[session](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [date] [date] NULL,
    [description] [nvarchar](max) NULL,
    [end_time] [time](7) NULL,
    [file_names] [nvarchar](max) NULL,
    [is_absent] [bit] NULL,
    [order] [tinyint] NULL,
    [start_time] [time](7) NULL,
    [course_id] [bigint] NOT NULL,
    [room_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[staff]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[staff](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [code] [char](36) NULL,
    [user_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UK7qatq4kob2sr6rlp44khhj53g] UNIQUE NONCLUSTERED
(
[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[student]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[student](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [code] [char](36) NULL,
    [level] [nvarchar](255) NULL,
    [note] [nvarchar](max) NULL,
    [user_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UKbkix9btnoi1n917ll7bplkvg5] UNIQUE NONCLUSTERED
(
[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[student_result]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[student_result](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [score] [real] NULL,
    [student_id] [bigint] NOT NULL,
    [subject_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
/****** Object:  Table [dbo].[subject]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[subject](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [code] [char](36) NULL,
    [description] [nvarchar](max) NULL,
    [fee] [decimal](18, 2) NULL,
    [image] [nvarchar](max) NULL,
    [is_active] [bit] NOT NULL,
    [max_student] [tinyint] NULL,
    [min_student] [tinyint] NULL,
    [session_number] [tinyint] NULL,
    [title] [nvarchar](100) NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[submission]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[submission](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [file_name] [nvarchar](max) NULL,
    [score] [int] NULL,
    [submited_date] [datetime2](6) NULL,
    [assignment_id] [bigint] NOT NULL,
    [student_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[teacher]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[teacher](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [certificate] [nvarchar](max) NULL,
    [code] [char](36) NULL,
    [is_full_time] [bit] NULL,
    [note] [nvarchar](max) NULL,
    [specialty] [nvarchar](max) NULL,
    [user_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [UKi5wqs2ds2vpmfpbcdxi9m2jvr] UNIQUE NONCLUSTERED
(
[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
/****** Object:  Table [dbo].[user]    Script Date: 7/22/2025 11:57:27 PM ******/
SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
CREATE TABLE [dbo].[user](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [address] [nvarchar](255) NULL,
    [avatar] [nvarchar](255) NULL,
    [created_date] [datetime2](6) NULL,
    [date_of_birth] [date] NULL,
    [email] [varchar](255) NULL,
    [first_name] [nvarchar](255) NULL,
    [gender] [bit] NULL,
    [is_active] [bit] NULL,
    [last_name] [nvarchar](255) NULL,
    [password] [nvarchar](255) NOT NULL,
    [phone] [varchar](255) NULL,
    [user_name] [nvarchar](255) NOT NULL,
    [role_id] [bigint] NOT NULL,
    PRIMARY KEY CLUSTERED
(
[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
    ) ON [PRIMARY]
ALTER TABLE [dbo].[assignment] ADD  DEFAULT ((1)) FOR [is_active]
ALTER TABLE [dbo].[assignment] ADD  DEFAULT ((10)) FOR [max_score]
ALTER TABLE [dbo].[comment] ADD  DEFAULT ((0)) FOR [is_appropriate]
ALTER TABLE [dbo].[course_student] ADD  DEFAULT ((0)) FOR [is_audit]
ALTER TABLE [dbo].[notification] ADD  DEFAULT ((0)) FOR [is_seen]
ALTER TABLE [dbo].[program] ADD  DEFAULT ((1)) FOR [is_active]
ALTER TABLE [dbo].[program] ADD  DEFAULT ((1)) FOR [max_student]
ALTER TABLE [dbo].[program] ADD  DEFAULT ((1)) FOR [min_student]
ALTER TABLE [dbo].[room] ADD  DEFAULT ((0)) FOR [is_available]
ALTER TABLE [dbo].[session] ADD  DEFAULT ((0)) FOR [is_absent]
ALTER TABLE [dbo].[subject] ADD  DEFAULT ((1)) FOR [is_active]
ALTER TABLE [dbo].[subject] ADD  DEFAULT ((1)) FOR [max_student]
ALTER TABLE [dbo].[subject] ADD  DEFAULT ((1)) FOR [min_student]
ALTER TABLE [dbo].[teacher] ADD  DEFAULT ((0)) FOR [is_full_time]
ALTER TABLE [dbo].[user] ADD  DEFAULT ((0)) FOR [gender]
ALTER TABLE [dbo].[user] ADD  DEFAULT ((1)) FOR [is_active]
ALTER TABLE [dbo].[assignment]  WITH CHECK ADD  CONSTRAINT [FKrop26uwnbkstbtfha3ormxp85] FOREIGN KEY([course_id])
    REFERENCES [dbo].[course] ([id])
ALTER TABLE [dbo].[assignment] CHECK CONSTRAINT [FKrop26uwnbkstbtfha3ormxp85]
ALTER TABLE [dbo].[comment]  WITH CHECK ADD  CONSTRAINT [FKgbigtugv1y5rq2dv37vamljf8] FOREIGN KEY([session_id])
    REFERENCES [dbo].[session] ([id])
ALTER TABLE [dbo].[comment] CHECK CONSTRAINT [FKgbigtugv1y5rq2dv37vamljf8]
ALTER TABLE [dbo].[comment]  WITH CHECK ADD  CONSTRAINT [FKn6xssinlrtfnm61lwi0ywn71q] FOREIGN KEY([user_id])
    REFERENCES [dbo].[user] ([id])
ALTER TABLE [dbo].[comment] CHECK CONSTRAINT [FKn6xssinlrtfnm61lwi0ywn71q]
ALTER TABLE [dbo].[course]  WITH CHECK ADD  CONSTRAINT [FKjrrmhfc1v50wehm2owb2uicii] FOREIGN KEY([staff_id])
    REFERENCES [dbo].[staff] ([id])
ALTER TABLE [dbo].[course] CHECK CONSTRAINT [FKjrrmhfc1v50wehm2owb2uicii]
ALTER TABLE [dbo].[course]  WITH CHECK ADD  CONSTRAINT [FKm1expnaas0onmafqpktmjixnx] FOREIGN KEY([subject_id])
    REFERENCES [dbo].[subject] ([id])
ALTER TABLE [dbo].[course] CHECK CONSTRAINT [FKm1expnaas0onmafqpktmjixnx]
ALTER TABLE [dbo].[course]  WITH CHECK ADD  CONSTRAINT [FKsybhlxoejr4j3teomm5u2bx1n] FOREIGN KEY([teacher_id])
    REFERENCES [dbo].[teacher] ([id])
ALTER TABLE [dbo].[course] CHECK CONSTRAINT [FKsybhlxoejr4j3teomm5u2bx1n]
ALTER TABLE [dbo].[course_student]  WITH CHECK ADD  CONSTRAINT [FK4xxxkt1m6afc9vxp3ryb0xfhi] FOREIGN KEY([student_id])
    REFERENCES [dbo].[student] ([id])
ALTER TABLE [dbo].[course_student] CHECK CONSTRAINT [FK4xxxkt1m6afc9vxp3ryb0xfhi]
ALTER TABLE [dbo].[course_student]  WITH CHECK ADD  CONSTRAINT [FKlmj50qx9k98b7li5li74nnylb] FOREIGN KEY([course_id])
    REFERENCES [dbo].[course] ([id])
ALTER TABLE [dbo].[course_student] CHECK CONSTRAINT [FKlmj50qx9k98b7li5li74nnylb]
ALTER TABLE [dbo].[curriculum]  WITH CHECK ADD  CONSTRAINT [FKalhjobapyhl78l2b5jmnjqejh] FOREIGN KEY([subject_id])
    REFERENCES [dbo].[subject] ([id])
ALTER TABLE [dbo].[curriculum] CHECK CONSTRAINT [FKalhjobapyhl78l2b5jmnjqejh]
ALTER TABLE [dbo].[curriculum]  WITH CHECK ADD  CONSTRAINT [FKjwtngqpu5kfm5vrlypsg1l144] FOREIGN KEY([program_id])
    REFERENCES [dbo].[program] ([id])
ALTER TABLE [dbo].[curriculum] CHECK CONSTRAINT [FKjwtngqpu5kfm5vrlypsg1l144]
ALTER TABLE [dbo].[enrollment]  WITH CHECK ADD  CONSTRAINT [FKf129b5wygotpl8f0v3osmys62] FOREIGN KEY([staff_id])
    REFERENCES [dbo].[staff] ([id])
ALTER TABLE [dbo].[enrollment] CHECK CONSTRAINT [FKf129b5wygotpl8f0v3osmys62]
ALTER TABLE [dbo].[enrollment]  WITH CHECK ADD  CONSTRAINT [FKio7fsy3vhvfgv7c0gjk15nyk4] FOREIGN KEY([student_id])
    REFERENCES [dbo].[student] ([id])
ALTER TABLE [dbo].[enrollment] CHECK CONSTRAINT [FKio7fsy3vhvfgv7c0gjk15nyk4]
ALTER TABLE [dbo].[enrollment]  WITH CHECK ADD  CONSTRAINT [FKk66akq3ie2s1iq71i51a1teka] FOREIGN KEY([subject_id])
    REFERENCES [dbo].[subject] ([id])
ALTER TABLE [dbo].[enrollment] CHECK CONSTRAINT [FKk66akq3ie2s1iq71i51a1teka]
ALTER TABLE [dbo].[enrollment]  WITH CHECK ADD  CONSTRAINT [FKsv31c7aw3p6lgvhaulei4jmwt] FOREIGN KEY([program_id])
    REFERENCES [dbo].[program] ([id])
ALTER TABLE [dbo].[enrollment] CHECK CONSTRAINT [FKsv31c7aw3p6lgvhaulei4jmwt]
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD  CONSTRAINT [FKko7f08v61t5y67teh5jxxwrea] FOREIGN KEY([course_id])
    REFERENCES [dbo].[course] ([id])
ALTER TABLE [dbo].[feedback] CHECK CONSTRAINT [FKko7f08v61t5y67teh5jxxwrea]
ALTER TABLE [dbo].[feedback]  WITH CHECK ADD  CONSTRAINT [FKnx2ciug1tx4kx3nea6xwhghs5] FOREIGN KEY([student_id])
    REFERENCES [dbo].[student] ([id])
ALTER TABLE [dbo].[feedback] CHECK CONSTRAINT [FKnx2ciug1tx4kx3nea6xwhghs5]
ALTER TABLE [dbo].[lesson]  WITH CHECK ADD  CONSTRAINT [FK7ydr23s8y9j6lip5qrngoymx4] FOREIGN KEY([subject_id])
    REFERENCES [dbo].[subject] ([id])
ALTER TABLE [dbo].[lesson] CHECK CONSTRAINT [FK7ydr23s8y9j6lip5qrngoymx4]
ALTER TABLE [dbo].[log]  WITH CHECK ADD  CONSTRAINT [FKo7yportrk4d8m6nlvccb6i3pq] FOREIGN KEY([user_id])
    REFERENCES [dbo].[user] ([id])
ALTER TABLE [dbo].[log] CHECK CONSTRAINT [FKo7yportrk4d8m6nlvccb6i3pq]
ALTER TABLE [dbo].[notification]  WITH CHECK ADD  CONSTRAINT [FK3x921lcnkybqyh7pqeg9u2x7j] FOREIGN KEY([notification_type_id])
    REFERENCES [dbo].[notification_type] ([id])
ALTER TABLE [dbo].[notification] CHECK CONSTRAINT [FK3x921lcnkybqyh7pqeg9u2x7j]
ALTER TABLE [dbo].[notification]  WITH CHECK ADD  CONSTRAINT [FKspjuqpmul833046oftkpgmr8a] FOREIGN KEY([user_id])
    REFERENCES [dbo].[user] ([id])
ALTER TABLE [dbo].[notification] CHECK CONSTRAINT [FKspjuqpmul833046oftkpgmr8a]
ALTER TABLE [dbo].[payment_history]  WITH CHECK ADD  CONSTRAINT [FK81dlv01c5mew3p6p9wabfiunt] FOREIGN KEY([enrollment_id])
    REFERENCES [dbo].[enrollment] ([id])
ALTER TABLE [dbo].[payment_history] CHECK CONSTRAINT [FK81dlv01c5mew3p6p9wabfiunt]
ALTER TABLE [dbo].[role_permission]  WITH CHECK ADD  CONSTRAINT [FKa6jx8n8xkesmjmv6jqug6bg68] FOREIGN KEY([role_id])
    REFERENCES [dbo].[role] ([id])
ALTER TABLE [dbo].[role_permission] CHECK CONSTRAINT [FKa6jx8n8xkesmjmv6jqug6bg68]
ALTER TABLE [dbo].[role_permission]  WITH CHECK ADD  CONSTRAINT [FKeqko22o3csobu921enei1n4ck] FOREIGN KEY([permission_id])
    REFERENCES [dbo].[permisstion] ([id])
ALTER TABLE [dbo].[role_permission] CHECK CONSTRAINT [FKeqko22o3csobu921enei1n4ck]
ALTER TABLE [dbo].[session]  WITH CHECK ADD  CONSTRAINT [FK5ibwg70x5r9hls6pqe5yg2vvb] FOREIGN KEY([course_id])
    REFERENCES [dbo].[course] ([id])
ALTER TABLE [dbo].[session] CHECK CONSTRAINT [FK5ibwg70x5r9hls6pqe5yg2vvb]
ALTER TABLE [dbo].[session]  WITH CHECK ADD  CONSTRAINT [FKoyfccms1psubki0cm7c92msrp] FOREIGN KEY([room_id])
    REFERENCES [dbo].[room] ([id])
ALTER TABLE [dbo].[session] CHECK CONSTRAINT [FKoyfccms1psubki0cm7c92msrp]
ALTER TABLE [dbo].[staff]  WITH CHECK ADD  CONSTRAINT [FKnga7npqjqkorj4odd8u6jgvxb] FOREIGN KEY([user_id])
    REFERENCES [dbo].[user] ([id])
ALTER TABLE [dbo].[staff] CHECK CONSTRAINT [FKnga7npqjqkorj4odd8u6jgvxb]
ALTER TABLE [dbo].[student]  WITH CHECK ADD  CONSTRAINT [FKl0k3f11t4o6e28f8aw8bkd31s] FOREIGN KEY([user_id])
    REFERENCES [dbo].[user] ([id])
ALTER TABLE [dbo].[student] CHECK CONSTRAINT [FKl0k3f11t4o6e28f8aw8bkd31s]
ALTER TABLE [dbo].[student_result]  WITH CHECK ADD  CONSTRAINT [FKie5072vb9vioj8nu7tuerdnr5] FOREIGN KEY([subject_id])
    REFERENCES [dbo].[subject] ([id])
ALTER TABLE [dbo].[student_result] CHECK CONSTRAINT [FKie5072vb9vioj8nu7tuerdnr5]
ALTER TABLE [dbo].[student_result]  WITH CHECK ADD  CONSTRAINT [FKsl2963tgdjk19e69pixkjogca] FOREIGN KEY([student_id])
    REFERENCES [dbo].[student] ([id])
ALTER TABLE [dbo].[student_result] CHECK CONSTRAINT [FKsl2963tgdjk19e69pixkjogca]
ALTER TABLE [dbo].[submission]  WITH CHECK ADD  CONSTRAINT [FK3q8643roa73llngo64dvpvtxt] FOREIGN KEY([assignment_id])
    REFERENCES [dbo].[assignment] ([id])
ALTER TABLE [dbo].[submission] CHECK CONSTRAINT [FK3q8643roa73llngo64dvpvtxt]
ALTER TABLE [dbo].[submission]  WITH CHECK ADD  CONSTRAINT [FKhncywuw9vwff2htaofx9m3m75] FOREIGN KEY([student_id])
    REFERENCES [dbo].[student] ([id])
ALTER TABLE [dbo].[submission] CHECK CONSTRAINT [FKhncywuw9vwff2htaofx9m3m75]
ALTER TABLE [dbo].[teacher]  WITH CHECK ADD  CONSTRAINT [FKtjndblnwjiqn6a4m10konnans] FOREIGN KEY([user_id])
    REFERENCES [dbo].[user] ([id])
ALTER TABLE [dbo].[teacher] CHECK CONSTRAINT [FKtjndblnwjiqn6a4m10konnans]
ALTER TABLE [dbo].[user]  WITH CHECK ADD  CONSTRAINT [FKdl9dqp078pc03g6kdnxmnlqpc] FOREIGN KEY([role_id])
    REFERENCES [dbo].[role] ([id])
ALTER TABLE [dbo].[user] CHECK CONSTRAINT [FKdl9dqp078pc03g6kdnxmnlqpc]
ALTER TABLE [dbo].[course]  WITH CHECK ADD CHECK  (([quantity]>=(0)))
ALTER TABLE [dbo].[room]  WITH CHECK ADD CHECK  (([capacity]>=(1)))
