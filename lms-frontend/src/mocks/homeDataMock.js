// === Home data for ENGLISH CENTER ===
// Ảnh dùng Unsplash/Pravatar (ổn định, không cần token)

export const featuredPrograms = [
    {
        id: 1,
        title: 'IELTS Foundation 4.0–5.0',
        priceFrom: 8900000,
        cover:
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop',
        summary: 'Nền tảng IELTS cho người mới — Listening, Reading, Writing, Speaking căn bản.'
    },
    {
        id: 2,
        title: 'IELTS Intensive 6.5+',
        priceFrom: 12900000,
        cover:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
        summary: 'Luyện đề & chiến thuật chuyên sâu, tăng tốc điểm trong 10–12 tuần.'
    },
    {
        id: 3,
        title: 'Business English',
        priceFrom: 9900000,
        cover:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
        summary: 'Tiếng Anh thương mại: email, thuyết trình, đàm phán, họp trực tuyến.'
    }
];

export const featuredSubjects = [
    {
        id: 11,
        title: 'Grammar Foundation',
        priceFrom: 4500000,
        cover:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop'
    },
    {
        id: 12,
        title: 'Listening Skills Basic',
        priceFrom: 5200000,
        cover:
            'https://images.unsplash.com/photo-1518365050014-f3a4c1726f2a?q=80&w=1600&auto=format&fit=crop'
    },
    {
        id: 13,
        title: 'Speaking Skills Basic',
        priceFrom: 5500000,
        cover:
            'https://images.unsplash.com/photo-1559136659-efe14ef6055d?q=80&w=1600&auto=format&fit=crop'
    },
    {
        id: 14,
        title: 'Reading Skills Essentials',
        priceFrom: 4900000,
        cover:
            'https://images.unsplash.com/photo-1519681394781-23a7884b0a2e?q=80&w=1600&auto=format&fit=crop'
    }
];

// --- Chương trình chi tiết (programs/:id) ---
export const programs = {
    1: {
        id: 1,
        title: 'IELTS Foundation 4.0–5.0',
        description:
            'Khoá nền tảng IELTS cho người mới bắt đầu, củng cố 4 kỹ năng với lộ trình từ căn bản đến trung cấp.',
        cover:
            'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1600&auto=format&fit=crop',
        totalHours: 48,
        price: 8900000,
        steps: [
            { id: 'listening', label: 'Listening', summary: 'Kỹ thuật nghe & ghi chú' },
            { id: 'reading', label: 'Reading', summary: 'Đọc hiểu & quản trị thời gian' },
            { id: 'writing', label: 'Writing', summary: 'Task 1 & Task 2 cơ bản' },
            { id: 'speaking', label: 'Speaking', summary: 'Phát âm & diễn đạt tự tin' }
        ],
        tracks: [
            {
                id: 'A',
                label: 'Track A',
                dow: 'T2-4-6',
                time: '18:00–20:00',
                start: '15/09/2025',
                mini: [
                    { label: 'Listening', range: '15/09–29/09' },
                    { label: 'Reading', range: 'AUTO' },
                    { label: 'Writing', range: 'AUTO' },
                    { label: 'Speaking', range: 'AUTO' }
                ]
            },
            {
                id: 'B',
                label: 'Track B',
                dow: 'T3-5-7',
                time: '18:30–20:30',
                start: '16/09/2025',
                mini: [
                    { label: 'Listening', range: '16/09–30/09' },
                    { label: 'Reading', range: 'AUTO' },
                    { label: 'Writing', range: 'AUTO' },
                    { label: 'Speaking', range: 'AUTO' }
                ]
            }
        ],
        details: [
            {
                step: 'Listening',
                objective: 'Làm quen dạng bài & kỹ năng note-taking',
                content: ['Prediction', 'Signpost words', 'Multiple choice', 'Gap-fill'],
                output: 'Listening band ~4.5–5.0'
            },
            {
                step: 'Reading',
                objective: 'Tăng tốc độ đọc & chiến lược chọn đáp án',
                content: ['Skimming/Scanning', 'T/F/NG', 'Matching headings', 'Summary completion'],
                output: 'Reading band ~4.5–5.0'
            },
            {
                step: 'Writing',
                objective: 'Viết Task 1 & Task 2 mạch lạc',
                content: ['Cấu trúc bài', 'Từ nối', 'Từ vựng học thuật cơ bản', 'Lỗi thường gặp'],
                output: 'Bài viết đạt yêu cầu cơ bản'
            },
            {
                step: 'Speaking',
                objective: 'Phản xạ & phát âm rõ ràng',
                content: ['Part 1 small talk', 'Part 2 cue card', 'Part 3 opinion', 'Pronunciation basics'],
                output: 'Tự tin trả lời 2–3 phút'
            }
        ]
    },
    2: {
        id: 2,
        title: 'IELTS Intensive 6.5+',
        description:
            'Khoá luyện đề chuyên sâu, tập trung chiến thuật & chữa bài chi tiết nhằm đạt mục tiêu 6.5+.',
        cover:
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop',
        totalHours: 60,
        price: 12900000,
        steps: [
            { id: 'strategy', label: 'Strategies', summary: 'Chiến thuật từng dạng' },
            { id: 'mocktest', label: 'Mock Tests', summary: 'Thi thử & chữa bài' },
            { id: 'feedback', label: '1–1 Feedback', summary: 'Sửa lỗi cá nhân' }
        ],
        tracks: [
            {
                id: 'A',
                label: 'Track A',
                dow: 'T2-4-6',
                time: '19:00–21:00',
                start: '22/09/2025',
                mini: [
                    { label: 'Strategies', range: '22/09–06/10' },
                    { label: 'Mock Tests', range: 'AUTO' },
                    { label: '1–1 Feedback', range: 'AUTO' }
                ]
            }
        ],
        details: [
            {
                step: 'Strategies',
                objective: 'Nắm chiến thuật nâng band nhanh',
                content: ['Timing', 'Trap types', 'Paraphrase & synonym', 'Coherence & cohesion'],
                output: 'Tăng độ chính xác & tốc độ làm bài'
            }
        ]
    },
    3: {
        id: 3,
        title: 'Business English',
        description:
            'Tiếng Anh thương mại cho người đi làm: email, cuộc họp, thuyết trình, đàm phán.',
        cover:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop',
        totalHours: 40,
        price: 9900000,
        steps: [
            { id: 'email', label: 'Email Writing', summary: 'Soạn email chuyên nghiệp' },
            { id: 'meeting', label: 'Meetings', summary: 'Họp & ghi biên bản' },
            { id: 'presentation', label: 'Presentation', summary: 'Thuyết trình tự tin' },
            { id: 'negotiation', label: 'Negotiation', summary: 'Đàm phán hiệu quả' }
        ],
        tracks: [
            {
                id: 'E',
                label: 'Evening',
                dow: 'T3-5',
                time: '19:00–21:00',
                start: '17/09/2025',
                mini: [
                    { label: 'Email', range: '17/09–24/09' },
                    { label: 'Meetings', range: 'AUTO' },
                    { label: 'Presentation', range: 'AUTO' },
                    { label: 'Negotiation', range: 'AUTO' }
                ]
            }
        ],
        details: [
            {
                step: 'Email Writing',
                objective: 'Email rõ ràng & lịch sự',
                content: ['Tone/formality', 'Structure', 'Common phrases', 'Do/Don’t'],
                output: 'Email đạt chuẩn công việc'
            }
        ]
    }
};

// --- Môn học chi tiết (subject/:id) ---
export const subjects = {
    11: {
        id: 11,
        title: 'Grammar Foundation',
        sessions: 20,
        price: 4500000,
        age: '10–16',
        cover:
            'https://images.unsplash.com/photo-1523246191208-9002d9be7f1c?q=80&w=1600&auto=format&fit=crop',
        outline: ['12 thì cơ bản', 'Câu điều kiện', 'Bị động', 'Mệnh đề quan hệ'],
        classes: [
            { courseId: 201, name: 'Lớp G01', start: '12/09/2025', schedule: 'T2–T6 17:00–18:30', seats: '12/16' },
            { courseId: 202, name: 'Lớp G02', start: '19/09/2025', schedule: 'T3–T7 18:45–20:15', seats: '6/14' }
        ]
    },
    12: {
        id: 12,
        title: 'Listening Skills Basic',
        sessions: 16,
        price: 5200000,
        age: '12–18',
        cover:
            'https://images.unsplash.com/photo-1518365050014-f3a4c1726f2a?q=80&w=1600&auto=format&fit=crop',
        outline: ['Hội thoại cơ bản', 'Kỹ thuật ghi chú', 'Từ vựng chủ đề', 'Luyện phản xạ'],
        classes: [
            { courseId: 101, name: 'Lớp L01', start: '15/09/2025', schedule: 'T2–T4 18:00–19:30', seats: '15/20' },
            { courseId: 102, name: 'Lớp L02', start: '22/09/2025', schedule: 'T3–T5 19:45–21:15', seats: '8/18' }
        ]
    },
    13: {
        id: 13,
        title: 'Speaking Skills Basic',
        sessions: 20,
        price: 5500000,
        age: '10–15',
        cover:
            'https://images.unsplash.com/photo-1559136659-efe14ef6055d?q=80&w=1600&auto=format&fit=crop',
        outline: ['Phản xạ giao tiếp', 'Từ vựng chủ đề', 'Phát âm chuẩn', 'Thuyết trình ngắn'],
        classes: [
            { courseId: 301, name: 'Lớp S01', start: '19/09/2025', schedule: 'T3–T5 18:00–19:30', seats: '12/18' },
            { courseId: 302, name: 'Lớp S02', start: '01/10/2025', schedule: 'T2–T4 19:45–21:15', seats: '8/16' }
        ]
    },
    14: {
        id: 14,
        title: 'Reading Skills Essentials',
        sessions: 16,
        price: 4900000,
        age: '12–18',
        cover:
            'https://images.unsplash.com/photo-1519681394781-23a7884b0a2e?q=80&w=1600&auto=format&fit=crop',
        outline: ['Từ khoá & tiêu điểm', 'Skimming/Scanning', 'Paraphrase', 'Tối ưu thời gian'],
        classes: [
            { courseId: 401, name: 'Lớp R01', start: '20/09/2025', schedule: 'T2–T6 17:30–19:00', seats: '10/18' }
        ]
    }
};

export const testimonials = [
    {
        id: 1,
        name: 'Nguyễn Minh Anh',
        role: 'Học viên IELTS',
        content:
            'Sau 3 tháng học tại trung tâm, mình đã đạt 6.5 IELTS. Giảng viên tận tâm, lộ trình rất rõ ràng.',
        avatar: 'https://i.pravatar.cc/100?img=12',
        rating: 5
    },
    {
        id: 2,
        name: 'Trần Văn Bình',
        role: 'Học viên Business English',
        content:
            'Khoá Business English giúp mình tự tin thuyết trình & họp với đối tác nước ngoài.',
        avatar: 'https://i.pravatar.cc/100?img=22',
        rating: 5
    },
    {
        id: 3,
        name: 'Lê Thị Cẩm',
        role: 'Phụ huynh',
        content:
            'Con mình học Speaking ở đây 6 tháng, giờ giao tiếp tự nhiên hơn hẳn.',
        avatar: 'https://i.pravatar.cc/100?img=36',
        rating: 5
    }
];

export const blogPosts = [
    {
        id: 1,
        title: '5 Bí quyết học IELTS hiệu quả',
        summary: 'Kinh nghiệm luyện đề & phân bổ thời gian từ học viên 7.0+.',
        cover:
            'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop',
        publishDate: '2025-09-01'
    },
    {
        id: 2,
        title: 'Roadmap học Speaking cho người bận rộn',
        summary: 'Tối ưu 30 phút mỗi ngày: shadowing, ghi âm, role-play.',
        cover:
            'https://images.unsplash.com/photo-1491833485966-73f5c76f0c46?q=80&w=1600&auto=format&fit=crop',
        publishDate: '2025-08-28'
    },
    {
        id: 3,
        title: 'Có nên bắt đầu IELTS từ lớp 8–9?',
        summary: 'Ưu/nhược điểm và cách chọn mục tiêu điểm phù hợp.',
        cover:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
        publishDate: '2025-08-25'
    }
];

export const faqData = [
    {
        question: 'Tôi có thể học thử trước khi đăng ký không?',
        answer:
            'Có, chúng tôi cung cấp buổi học thử miễn phí cho tất cả khóa học. Bạn có thể đăng ký học thử qua hotline hoặc website.'
    },
    {
        question: 'Chính sách hoàn phí như thế nào?',
        answer:
            'Nếu không hài lòng sau 3 buổi đầu, bạn được hoàn 100% học phí. Sau đó, hoàn theo tỷ lệ buổi còn lại.'
    },
    {
        question: 'Tôi có thể chuyển lớp/track khác không?',
        answer:
            'Có thể trong tuần đầu nếu còn chỗ. Phí chuyển lớp là 200.000đ.'
    },
    {
        question: 'Giảng viên có chứng chỉ gì?',
        answer:
            'Giảng viên có bằng sư phạm/ngôn ngữ, chứng chỉ TESOL/CELTA và kinh nghiệm ≥3 năm.'
    },
    {
        question: 'Lớp học có bao nhiêu học viên?',
        answer:
            'Tối đa 18 học viên/lớp; lớp VIP tối đa 8 học viên.'
    },
    {
        question: 'Có hỗ trợ học bù nếu vắng mặt không?',
        answer:
            'Có thể học bù lớp cùng trình độ trong tuần hoặc xem video ghi hình (với một số khoá).'
    }
];
