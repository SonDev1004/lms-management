//mockCourses.js

export const courses = [
    {
        id: 1,
        title: "Thuyết trình bằng TA - K08/2025",
        subject_name: "Thuyết trình TA",
        description: "Khoá rèn luyện kỹ năng thuyết trình tiếng Anh.",
        start_date: "2025-08-24",
        end_date: "2025-11-30",
        student_count: 14,
        student_capacity: 16,
        status: 1, // teaching
        current_session: 5,
        total_session: 12,
        schedule: [
            { day: "T2", time: "18:00-19:30" },
            { day: "T4", time: "18:00-19:30" }
        ],
        room: "K20",
        teacher_id: 39
    },
    {
        id: 2,
        title: "IELTS Listening - K09/2025",
        subject_name: "IELTS Listening",
        description: "Luyện kỹ năng nghe IELTS theo đề thật.",
        start_date: "2025-09-01",
        end_date: "2025-11-30",
        student_count: 18,
        student_capacity: 20,
        status: 1, // teaching
        current_session: 4,
        total_session: 20,
        schedule: [
            { day: "T3", time: "18:00-19:30" },
            { day: "T5", time: "18:00-19:30" }
        ],
        room: "B1",
        teacher_id: 39
    },
    {
        id: 3,
        title: "TOEIC Foundation - K07/2025",
        subject_name: "TOEIC",
        description: "Khoá TOEIC nền tảng cho người mới bắt đầu.",
        start_date: "2025-10-01",
        end_date: "2025-12-20",
        student_count: 20,
        student_capacity: 25,
        status: 0, // finished
        current_session: 18,
        total_session: 18,
        schedule: [
            { day: "T6", time: "17:30-19:00" }
        ],
        room: "A1",
        teacher_id: 39
    },
    {
        id: 4,
        title: "Giao tiếp TA cơ bản - K06/2025",
        subject_name: "English Speaking",
        description: "Luyện kỹ năng giao tiếp tiếng Anh hàng ngày.",
        start_date: "2025-07-10",
        end_date: "2025-09-29",
        student_count: 16,
        student_capacity: 18,
        status: 0, // finished
        current_session: 12,
        total_session: 12,
        schedule: [
            { day: "CN", time: "09:00-11:00" }
        ],
        room: "B2",
        teacher_id: 39
    },
    {
        id: 5,
        title: "IELTS Writing - K10/2025",
        subject_name: "IELTS Writing",
        description: "Luyện viết IELTS task 2 đạt target 6.5+.",
        start_date: "2025-11-15",
        end_date: "2026-01-15",
        student_count: 10,
        student_capacity: 16,
        status: 2, // upcoming
        current_session: 0,
        total_session: 14,
        schedule: [
            { day: "T7", time: "18:00-20:00" }
        ],
        room: "C1",
        teacher_id: 39
    },
    {
        id: 6,
        title: "TOEFL Junior - K03/2025",
        subject_name: "TOEFL Junior",
        description: "Luyện thi TOEFL Junior cho học sinh cấp 2.",
        start_date: "2025-12-01",
        end_date: "2026-03-01",
        student_count: 9,
        student_capacity: 18,
        status: 2, // upcoming
        current_session: 0,
        total_session: 18,
        schedule: [
            { day: "T4", time: "16:00-17:30" }
        ],
        room: "A4",
        teacher_id: 39
    },
    {
        id: 7,
        title: "TOEIC Speaking - K12/2025",
        subject_name: "TOEIC Speaking",
        description: "Khoá luyện kỹ năng speaking cho TOEIC.",
        start_date: "2025-04-10",
        end_date: "2025-07-10",
        student_count: 12,
        student_capacity: 15,
        status: 3, // canceled
        current_session: 2,
        total_session: 12,
        schedule: [
            { day: "T2", time: "19:00-20:30" }
        ],
        room: "B5",
        teacher_id: 39
    },
    {
        id: 8,
        title: "Business English - K05/2025",
        subject_name: "Business English",
        description: "Tiếng Anh thương mại cho người đi làm.",
        start_date: "2025-03-12",
        end_date: "2025-06-15",
        student_count: 14,
        student_capacity: 20,
        status: 1, // teaching
        current_session: 7,
        total_session: 16,
        schedule: [
            { day: "T3", time: "18:30-20:00" }
        ],
        room: "A3",
        teacher_id: 40 // Giáo viên khác, để test filter
    },
    {
        id: 9,
        title: "SAT English - K03/2025",
        subject_name: "SAT English",
        description: "Luyện thi SAT phần tiếng Anh.",
        start_date: "2025-02-10",
        end_date: "2025-05-10",
        student_count: 8,
        student_capacity: 15,
        status: 0, // finished
        current_session: 15,
        total_session: 15,
        schedule: [
            { day: "T6", time: "15:00-16:30" }
        ],
        room: "D1",
        teacher_id: 41 // Giáo viên khác
    },
    {
        id: 10,
        title: "IELTS Reading - K11/2025",
        subject_name: "IELTS Reading",
        description: "Khoá đọc hiểu IELTS luyện đề 2025.",
        start_date: "2025-10-01",
        end_date: "2025-12-01",
        student_count: 19,
        student_capacity: 22,
        status: 1, // teaching
        current_session: 6,
        total_session: 12,
        schedule: [
            { day: "T5", time: "17:00-18:30" }
        ],
        room: "B8",
        teacher_id: 39
    }
];
