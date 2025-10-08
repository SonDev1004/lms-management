export const programs = [
    { id: 'ielts', category: 'IELTS', title: 'IELTS' },
    { id: 'toeic', category: 'TOEIC', title: 'TOEIC' },
    { id: 'speaking', category: 'Speaking', title: 'Speaking' },
    { id: 'junior', category: 'Junior', title: 'Junior' },
    { id: 'grammar-vocab', category: 'Grammar & Vocab', title: 'Grammar & Vocab' },
];

export const subjects = [
    { id: 'ielts-found-begin', programId: 'ielts', title: 'Beginner (4.0–5.0)', track: 'IELTS Foundation', duration: '3 months', sessionsPerWeek: 3, mode: 'Hybrid', target: '5.5–6.0', tuitionMin: 8000000, tuitionMax: 12000000, badge: '' },
    { id: 'ielts-inter-med',   programId: 'ielts', title: 'Intermediate (5.0–6.0)', track: 'IELTS Intermediate', duration: '2.5 months', sessionsPerWeek: 3, mode: 'Hybrid', target: '6.5–7.0', tuitionMin: 9000000, tuitionMax: 14000000, badge: 'Phổ biến nhất' },
    { id: 'ielts-adv-high',    programId: 'ielts', title: 'Advanced (6.0–7.0)', track: 'IELTS Advanced', duration: '2 months', sessionsPerWeek: 3, mode: 'Hybrid', target: '7.5–8.0', tuitionMin: 10000000, tuitionMax: 15000000, badge: '' },

    // TOEIC
    { id: 'toeic-found-basic', programId: 'toeic', title: 'Beginner (300–500)', track: 'TOEIC Foundation', duration: '2.5 months', sessionsPerWeek: 2, mode: 'Hybrid', target: '600–700', tuitionMin: 6000000, tuitionMax: 9000000, badge: 'Cho người mới bắt đầu' },
    { id: 'toeic-inter-med',   programId: 'toeic', title: 'Intermediate (500–700)', track: 'TOEIC Intermediate', duration: '2 months', sessionsPerWeek: 2, mode: 'Hybrid', target: '750–850', tuitionMin: 7000000, tuitionMax: 10000000, badge: 'Phổ biến nhất' },

    // Speaking (ví dụ)
    { id: 'speak-confidence',  programId: 'speaking', title: 'All levels', track: 'Speaking Confidence', duration: '1.5 months', sessionsPerWeek: 2, mode: 'Hybrid', target: 'Fluent conversation', tuitionMin: 3000000, tuitionMax: 4500000, badge: 'Phổ biến nhất' },
];

export const schedules = [
    { id: 'IELTS-2025-A', subjectId: 'ielts-found-begin', title: 'IELTS-2025-A' },
    { id: 'IELTS-2025-B', subjectId: 'ielts-found-begin', title: 'IELTS-2025-B' },
    { id: 'IELTS-2025-C', subjectId: 'ielts-found-begin', title: 'IELTS-2025-C' },
    { id: 'IELTSI-2025-A', subjectId: 'ielts-inter-med', title: 'IELTSI-2025-A' },
    { id: 'TOEIC-2025-A', subjectId: 'toeic-found-basic', title: 'TOEIC-2025-A' },
];
export const classesBySchedule = {
    'IELTS-2025-A': [
        {
            id: 'cls-rl-a-eve',
            name: 'IELTS Reading & Listening – Track A Evening',
            code: 'COURSE-20250916-5971158C',
            startDate: '2025-10-01',
            scheduleText: 'Thứ 2–Thứ 4–Thứ 6 18:00–20:00',
            sessions: 20,
            classSize: 15,
            status: 'OPEN',
        },
        {
            id: 'cls-sw-a-eve',
            name: 'IELTS Speaking & Writing – Track A Evening',
            code: 'COURSE-20250916-3AF6C657',
            startDate: '2025-11-04',
            scheduleText: 'Thứ 2–Thứ 4–Thứ 6 18:00–20:00',
            sessions: 20,
            classSize: 25,
            status: 'PENDING',
        },
    ],
    'IELTS-2025-B': [],
    'IELTS-2025-C': [],
    'IELTSI-2025-A': [
        {
            id: 'cls-inter-1',
            name: 'IELTS Intermediate – Evening',
            code: 'COURSE-20251010-INT-A',
            startDate: '2025-10-10',
            scheduleText: 'Thứ 3–Thứ 5 18:30–20:30',
            sessions: 20,
            classSize: 22,
            status: 'OPEN',
        },
    ],
    'TOEIC-2025-A': [
        {
            id: 'cls-toeic-a-morning',
            name: 'TOEIC Foundation Morning',
            code: 'COURSE-20250916-TOEIC-A',
            startDate: '2025-10-12',
            scheduleText: 'Thứ 3–Thứ 5 08:30–10:30',
            sessions: 16,
            classSize: 20,
            status: 'OPEN',
        },
    ],
};

export const programsPopular = [
    { id: 'ielts-found-begin', title: 'IELTS Foundation – Beginner', rating: 4.9, target: '5.5–6.0', months: 3 },
    { id: 'ielts-inter-med',   title: 'IELTS Intermediate',          rating: 4.9, target: '6.5–7.0', months: 2.5 },
    { id: 'ielts-adv-high',    title: 'IELTS Advanced',              rating: 4.9, target: '7.5–8.0', months: 2 },
];