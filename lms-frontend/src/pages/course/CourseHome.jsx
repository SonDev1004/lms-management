import React, { useEffect, useMemo, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';
import './CourseHome.css';

const subjectColors = {
    IELTS: '#1976d2',
    TOEIC: '#f57c00',
    TOEFL: '#0288d1'
};

function hashStringToInt(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h;
}

const PALETTE = [
    '#1976d2', // blue (default IELTS)
    '#0288d1', // cyan / teal
    '#43a047', // green
    '#7cb342', // light green
    '#f9a825', // amber (yellow/gold)
    '#f57c00', // orange
    '#e53935', // red (muted)
    '#8e24aa', // purple
    '#5c6bc0', // indigo
    '#00897b', // teal darker
    '#546e7a', // blue-grey
    '#6d4c41'  // brown
];

function generatePaletteColorForSubject(subject) {
    const key = subject ? String(subject) : Math.random().toString();
    const idx = hashStringToInt(key) % PALETTE.length;
    return PALETTE[idx];
}

function getContrastColor(cssColor) {
    if (!cssColor) return '#222';
    const c = cssColor.trim();

    if (c.startsWith('#')) {
        const hex = c.slice(1);
        const hexFull = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex;
        const bigint = parseInt(hexFull, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 160 ? '#222' : '#FAFAFA';
    }

    if (c.startsWith('hsl')) {
        const inside = c.substring(c.indexOf('(') + 1, c.lastIndexOf(')'));
        const parts = inside.split(/[, ]+/).filter(Boolean);
        if (parts.length >= 3) {
            const lPart = parts[2];
            const m = lPart.match(/(\d+(\.\d+)?)/);
            if (m) {
                const l = Number(m[1]);
                return l >= 64 ? '#222' : '#FAFAFA';
            }
        }
        return '#222';
    }

    return '#222';
}

const mockCourses = [
    {
        id: '201',
        title: 'IELTS Speaking Booster',
        subject: 'IELTS Speaking',
        session_number: 12,
        attended_sessions: 3,
        description: 'Luyện phản xạ nói, part 2 & 3, feedback sửa phát âm và mở rộng ý.',
        is_active: true,
        start_date: '2025-08-01',
        teacher: 'Lê Hồng Anh',
        schedule: 'T3-T5 19:00-20:30',
        reminders: ['Chuẩn bị: topic talk tuần 2', 'Bài tập: record 2 mẫu trả lời'],
        room: 'P203'
    },
    {
        id: '202',
        title: 'TOEFL Listening Mastery',
        subject: 'Listening Skills',
        session_number: 16,
        attended_sessions: 0,
        description: 'Chiến thuật nghe bài dài, note-taking và phân tích câu hỏi nghe TOEFL.',
        is_active: true,
        start_date: '2025-09-10',
        teacher: 'Phạm Minh Tú',
        schedule: 'T2-T4 18:30-20:00',
        reminders: ['Đăng ký test mẫu', 'Chuẩn bị: danh sách từ vựng chuyên ngành'],
        room: 'P305'
    },
    {
        id: '203',
        title: 'Academic Reading Intensive',
        subject: 'Academic Reading',
        session_number: 18,
        attended_sessions: 6,
        description: 'Phân tích passage học thuật, skimming/scanning, tốc độ đọc cho IELTS/TOEFL.',
        is_active: true,
        start_date: '2025-07-15',
        teacher: 'Nguyễn Thùy Dương',
        schedule: 'T3-T6 09:00-10:30',
        reminders: ['Ôn tập: passage tuần 3', 'Submit: summary bài đọc tuần 2'],
        room: 'P110'
    },
    {
        id: '204',
        title: 'IELTS Writing Workshop',
        subject: 'IELTS Writing',
        session_number: 10,
        attended_sessions: 0,
        description: 'Task 1 & 2: cấu trúc bài, từ vựng học thuật và sửa bài mẫu.',
        is_active: true,
        start_date: '2025-10-05',
        teacher: 'Trần Mai Lan',
        schedule: 'T7 13:30-16:30',
        reminders: ['Chuẩn bị: viết draft Task 2', 'Deadline nộp bài mẫu tuần 1'],
        room: 'P402'
    },
    {
        id: '205',
        title: 'TOEIC Listening Sprint',
        subject: 'TOEIC Listening',
        session_number: 14,
        attended_sessions: 4,
        description: 'Kỹ thuật làm Part 1-4, phân biệt âm, tốc độ nghe thật nhanh.',
        is_active: true,
        start_date: '2025-08-20',
        teacher: 'Lưu Văn Hùng',
        schedule: 'T2-T4 07:30-09:00',
        reminders: ['Bài thi thử: Part 3 vào thứ 4', 'Ôn từ vựng chủ đề Workplace'],
        room: 'P401'
    },
    {
        id: '206',
        title: 'Advanced Reading for Exams',
        subject: 'Academic Reading',
        session_number: 20,
        attended_sessions: 20,
        description: 'Khóa đã hoàn thành: kỹ năng đọc nâng cao, phân tích chiến lược làm bài thi.',
        is_active: false,
        start_date: '2025-06-10',
        teacher: 'Phan Thị Hồng',
        schedule: 'T2-T4-T6 17:00-18:30',
        reminders: ['Đã kết thúc — xem lại feedback cuối khoá'],
        room: 'P108'
    },
    {
        id: '207',
        title: 'Pronunciation Clinic (Accent Reduction)',
        subject: 'Pronunciation Clinic',
        session_number: 8,
        attended_sessions: 1,
        description: 'Tập trung vào âm khó, nối âm, nhấn nhá để tăng độ hiểu khi nói tiếng Anh.',
        is_active: true,
        start_date: '2025-09-22',
        teacher: 'Đỗ Thanh Vân',
        schedule: 'T5 18:00-20:00',
        reminders: ['Chuẩn bị: ghi âm 1 minute speech', 'Practice: minimal pairs list'],
        room: 'P207'
    },
    {
        id: '208',
        title: 'Writing for Band 7+',
        subject: 'IELTS Writing',
        session_number: 12,
        attended_sessions: 5,
        description: 'Hướng dẫn ngữ pháp, cohesion/coherence, và template nâng band Writing.',
        is_active: true,
        start_date: '2025-07-30',
        teacher: 'Vũ Nguyễn Lan',
        schedule: 'T3 18:30-20:30',
        reminders: ['Nộp draft Task 1 tuần này', 'Chuẩn bị: peer review bài viết'],
        room: 'P310'
    },
    {
        id: '209',
        title: 'Listening & Note-taking Skills',
        subject: 'Listening Skills',
        session_number: 10,
        attended_sessions: 0,
        description: 'Kỹ năng note-taking cho lecture, dictation, và tập luyện tốc độ ghi chép.',
        is_active: true,
        start_date: '2025-11-01',
        teacher: 'Hoàng Minh Khoa',
        schedule: 'T6 14:00-16:00',
        reminders: ['Chuẩn bị: bộ đề lecture sample', 'Practice: 10-min dictation daily'],
        room: 'P506'
    },
    {
        id: '210',
        title: 'Speaking Club — Conversation Practice',
        subject: 'Conversation Club',
        session_number: 12,
        attended_sessions: 2,
        description: 'Câu lạc bộ nói tự do, chủ đề hàng tuần, feedback small group.',
        is_active: true,
        start_date: '2025-08-25',
        teacher: 'Mai Thị Hương',
        schedule: 'T4 19:00-20:30',
        reminders: ['Topic tuần này: Travel & Culture', 'Chuẩn bị 2 câu hỏi mở để thảo luận'],
        room: 'P121'
    }
];

function classifyReminder(text) {
    if (!text) return 'normal';
    const t = text.toLowerCase();
    if (/(hoàn thành|nộp|deadline|bài thi|gấp|urgent|submit|due)/i.test(t)) return 'urgent';
    if (/(chuẩn bị|prepare|presentation|agenda|chuẩn bị)/i.test(t)) return 'prepare';
    if (/(ôn tập|ôn|ôn từ|review|practice|luyện)/i.test(t)) return 'review';
    return 'normal';
}

const reminderIcons = {
    urgent: { emoji: '⏰', label: 'Deadline' },
    prepare: { emoji: '📝', label: 'Chuẩn bị' },
    review: { emoji: '📖', label: 'Ôn tập' },
    normal: { emoji: '🔔', label: 'Nhắc' }
};

function fetchCoursesMock() {
    return new Promise(resolve => setTimeout(() => resolve(mockCourses), 120));
}

function formatDateISO(isoString) {
    if (!isoString) return '-';
    const d = isoString instanceof Date ? isoString : new Date(isoString);
    try {
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
    } catch {
        return isoString;
    }
}

export default function CourseHome() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filter, setFilter] = useState('Tất cả');

    useEffect(() => {
        let mounted = true;
        fetchCoursesMock().then(data => {
            if (!mounted) return;
            setCourses(data);
        });
        return () => { mounted = false; };
    }, []);

    const now = useMemo(() => new Date(), []);

    const uiCourses = useMemo(() => courses.map(c => {
        // ưu tiên color cố định nếu có mapping, ngược lại lấy từ PALETTE
        const accent = subjectColors[c.subject] || generatePaletteColorForSubject(c.subject || c.title || c.id);
        const startDate = c.start_date ? new Date(c.start_date) : null;
        const hasStarted = startDate ? now >= startDate : false;
        const hasFinished = startDate ? now > startDate && !c.is_active : false;
        const clickable = Boolean(c.is_active && hasStarted && !hasFinished);
        const accentText = getContrastColor(accent);
        return { ...c, subjectColor: accent, startDate, hasStarted, hasFinished, clickable, accentText };
    }), [courses, now]);

    const counts = useMemo(() => ({
        'Tất cả': uiCourses.length,
        'Đang học': uiCourses.filter(c => c.clickable).length,
        'Sắp mở': uiCourses.filter(c => !c.hasStarted).length,
        'Đã học': uiCourses.filter(c => c.hasFinished).length
    }), [uiCourses]);

    const visible = useMemo(() => {
        if (filter === 'Tất cả') return uiCourses;
        if (filter === 'Đang học') return uiCourses.filter(c => c.clickable);
        if (filter === 'Sắp mở') return uiCourses.filter(c => !c.hasStarted);
        if (filter === 'Đã học') return uiCourses.filter(c => c.hasFinished);
        return uiCourses;
    }, [uiCourses, filter]);

    const handleKeyActivate = (e, c) => {
        if (!c.clickable) return;
        if (['Enter', ' ', 'Spacebar'].includes(e.key)) {
            e.preventDefault();
            navigate(`/course/detail/${c.id}`);
        }
    };

    return (
        <div className="course-wrapper p-d-flex p-flex-column">
            <div className="controls" style={{ padding: '0 16px' }}>
                <div className="filter-bar" role="toolbar" aria-label="Bộ lọc trạng thái lớp">
                    {['Tất cả', 'Đang học', 'Sắp mở', 'Đã học'].map(opt => (
                        <button
                            key={opt}
                            className={`filter-btn ${filter === opt ? 'is-active' : ''}`}
                            onClick={() => setFilter(opt)}
                            aria-pressed={filter === opt}
                            aria-label={`${opt} (${counts[opt] ?? 0})`}
                        >
                            <span className="filter-label">{opt}</span>
                            <span className="filter-count">({counts[opt] ?? 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="course-grid" role="list" aria-live="polite">
                <Tooltip target=".btn-tooltip" position="top" mouseTrack mouseTrackLeft={10} />

                {visible.map(c => {
                    const accent = c.subjectColor;
                    const accentText = c.accentText || getContrastColor(accent);
                    const metaTextColor = accentText === '#FAFAFA' ? 'rgba(255,255,255,0.86)' : 'rgba(34,34,34,0.78)';
                    const metaBg = accentText === '#FAFAFA' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
                    const headerStyle = { background: accent, color: accentText };

                    const footer = (
                        <div className="card-footer">
                            <Button
                                label="Tài liệu"
                                icon="pi pi-folder"
                                className="footer-btn btn-tooltip"
                                data-pr-tooltip="Tài liệu"
                                aria-label={`Tài liệu ${c.title}`}
                                onClick={e => e.stopPropagation()}
                                disabled={!c.clickable}
                                style={{ background: accent, color: accentText, border: `1px solid ${accent}` }}
                            />
                            <Button
                                label="Chi tiết"
                                icon="pi pi-info-circle"
                                className="footer-btn btn-tooltip"
                                data-pr-tooltip="Chi tiết"
                                aria-label={`Chi tiết ${c.title}`}
                                onClick={e => { e.stopPropagation(); if (c.clickable) navigate(`/course/detail/${c.id}`); }}
                                disabled={!c.clickable}
                                style={{ background: 'transparent', color: accent, border: `1px solid ${accent}` }}
                            />
                        </div>
                    );

                    return (
                        <Card
                            key={c.id}
                            className={`course-card ${c.clickable ? 'clickable' : 'disabled'}`}
                            style={{ height: '100%' }}
                            header={
                                <div className="card-header" style={headerStyle}>
                                    <div className="header-left">
                                        <div className="title-wrap">
                                            <h3 className="title" title={c.title} style={{ color: accentText }}>{c.title}</h3>
                                            <p className="subtitle" style={{ color: accentText }}>{c.subject}</p>
                                        </div>

                                        <div className="header-meta" style={{ marginTop: 8, color: metaTextColor }}>
                                            <div className="meta-row" style={{ background: metaBg }}>
                                                <i className="pi pi-user" aria-hidden="true" />
                                                <div className="meta-text">
                                                    <strong className="meta-label">GV:</strong>
                                                    <span className="meta-value meta-teacher">{c.teacher}</span>
                                                </div>
                                            </div>

                                            <div className="meta-row" style={{ marginTop: 8, background: metaBg }}>
                                                <i className="pi pi-clock" aria-hidden="true" />
                                                <div className="meta-text">
                                                    <span className="meta-value meta-schedule">{c.schedule}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="header-right">
                                        <div className="room-badge" aria-hidden="true" style={{ background: accentText === '#FAFAFA' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)', color: accentText }}>{c.room}</div>
                                        <div className="start-date" style={{ color: accentText }}>Khai giảng: {formatDateISO(c.start_date)}</div>
                                    </div>
                                </div>
                            }
                            footer={footer}
                            onClick={() => c.clickable && navigate(`/course/detail/${c.id}`)}
                            role="listitem"
                            tabIndex={c.clickable ? 0 : -1}
                            onKeyDown={e => handleKeyActivate(e, c)}
                            aria-label={`${c.subject} - ${c.title}`}
                            aria-disabled={!c.clickable}
                        >
                            <div className="card-body fixed-layout">
                                <div className="body-left">
                                    <div className="desc-wrapper">
                                        <div className="desc" role="region" aria-label={`Mô tả khóa ${c.title}`}>
                                            {c.description}
                                        </div>

                                        <div className="reminders">
                                            <strong>Nhắc nhở / Bài tập</strong>
                                            <ul className="reminder-list" aria-live="polite">
                                                {c.reminders && c.reminders.length ? c.reminders.map((r, idx) => {
                                                    const kind = classifyReminder(r);
                                                    const ic = reminderIcons[kind] || reminderIcons.normal;
                                                    return (
                                                        <li className={`reminder-item reminder-${kind}`} key={idx} title={r}>
                                                            <span className="reminder-icon" role="img" aria-label={ic.label}>{ic.emoji}</span>
                                                            <span className="reminder-text">{r}</span>
                                                        </li>
                                                    );
                                                }) : (<li className="reminder-item reminder-normal">Không có nhắc nhở</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="body-right">
                                    <div className="info-row">
                                        <div><strong>Buổi:</strong> <span className="muted"> {c.attended_sessions}/{c.session_number}</span></div>
                                    </div>

                                    <div className={`status-pill ${c.clickable ? 'active' : c.hasFinished ? 'finished' : 'upcoming'}`} style={{ marginTop: 12 }}>
                                        {c.clickable ? 'Đang học' : c.hasFinished ? 'Đã học' : 'Sắp khai giảng'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
