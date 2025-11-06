// mocks/mockAssignments.js

const isoAt = (date, h = 18, m = 0) => {
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
};

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

export const mockAssignments = [
    {
        id: 1,
        title: "Reading - Week 2",
        max_score: 10,
        file_name: "reading2.pdf",
        factor: 10, // nếu muốn hệ số là phần trăm (10 = 10%)
        due_date: "2025-20-10T18:00:00.000Z",
        is_active: true,
        course_id: 1,
    },
    {
        id: 2,
        title: "Writing Task 1",
        max_score: 10,
        file_name: "writing1.pdf",
        factor: 10,
        due_date: "2025-08-05T18:00:00.000Z",
        is_active: true,
        course_id: 1,
    },
    {
        id: 3,
        title: "Listening Quiz 1",
        max_score: 10,
        file_name: "listening1.pdf",
        factor: 10,
        due_date: "2025-08-12T18:00:00.000Z",
        is_active: true,
        course_id: 1,
    },
    {
        id: 4,
        title: "Speaking Practice 1",
        max_score: 10,
        file_name: "speaking1.pdf",
        factor: 10,
        due_date: "2025-08-15T18:00:00.000Z",
        is_active: true,
        course_id: 1,
    },
    {
        id: 5,
        title: "Grammar Quiz",
        max_score: 10,
        file_name: "grammar.pdf",
        factor: 10,
        due_date: "2025-08-18T18:00:00.000Z",
        is_active: true,
        course_id: 1,
    },
    // Assignment cho khoá khác
    {
        id: 6,
        title: "Reading - Week 1",
        max_score: 10,
        file_name: "reading1.pdf",
        factor: 10,
        due_date: "2025-08-01T18:00:00.000Z",
        is_active: true,
        course_id: 2,
    },
];

// (tuỳ chọn) Helper status để gắn badge nhanh
export const getAssignmentStatus = (iso) => {
    if (!iso) return { key: "none", label: "Chưa đặt hạn" };
    const now = new Date();
    const d = new Date(iso);

    const sameDay =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();

    if (d < now && !sameDay) return { key: "past", label: "Quá hạn" };
    if (sameDay) return { key: "today", label: "Hôm nay" };
    return { key: "future", label: "Sắp tới" };
};
