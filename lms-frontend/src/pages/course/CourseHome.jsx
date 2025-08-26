import React, { useMemo, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';
import './CourseHome.css';

const subjectColors = {
    IELTS: '#1976d2',
    TOEIC: '#f57c00',
    TOEFL: '#0288d1',
    'Tiếng Anh Giao Tiếp': '#c2185b',
    'Tiếng Anh Thiếu Nhi': '#43a047',
    'Business English': '#5d4037',
    Pronunciation: '#e64a19',
    default: '#6a1b9a'
};

const statusColors = {
    'Đang học': '#43a047',
    'Sắp mở': '#fbc02d',
    'Đã học': '#757575',
    'Mở đăng ký': '#fb8c00',
    'Tạm hoãn': '#c2185b',
    default: '#9e9e9e'
};

const rawCourses = [
    {
        id: 'c1',
        subject: 'IELTS',
        course: 'IELTS Intermediate',
        teacher: 'Ngô Tồng Quốc',
        room: 'P101',
        schedule: 'T2-T4 18:00-20:00',
        reminders: ['Hoàn thành bt: Unit 4 - bài tập 1-4', 'Chuẩn bị presentation tuần tới'],
        status: 'Đang học'
    },
    {
        id: 'c2',
        subject: 'IELTS',
        course: 'IELTS Foundation',
        teacher: 'Ngân Đặng Hà Thanh',
        room: 'P202',
        schedule: 'T3-T5 08:00-10:00',
        reminders: ['Đọc passage trang 22', 'Nộp bài nghe hôm nay'],
        status: 'Mở đăng ký'
    },
    {
        id: 'c3',
        subject: 'Tiếng Anh Giao Tiếp',
        course: 'Giao tiếp nâng cao',
        teacher: 'Nguyễn Văn A',
        room: 'P303',
        schedule: 'T7-CN 14:00-16:00',
        reminders: ['Luyện nói: topic Holidays', 'Xem video mẫu trước giờ học'],
        status: 'Sắp mở'
    },
    {
        id: 'c4',
        subject: 'Tiếng Anh Thiếu Nhi',
        course: 'Starters Movers Flyers',
        teacher: 'Lê Thị B',
        room: 'P105',
        schedule: 'T2-T6 17:00-18:30',
        reminders: ['Tập hát bài mới', 'Học từ vựng: Animals'],
        status: 'Đang học'
    },
    {
        id: 'c5',
        subject: 'Business English',
        course: 'Thương mại nâng cao',
        teacher: 'Phạm Văn C',
        room: 'P201',
        schedule: 'T3-T5 19:00-21:00',
        reminders: ['Chuẩn bị case study', 'Đọc báo cáo Q2'],
        status: 'Đã học'
    },
    {
        id: 'c6',
        subject: 'TOEIC',
        course: 'TOEIC 500+',
        teacher: 'Trần Văn D',
        room: 'P401',
        schedule: 'T2-T4-T6 08:00-09:30',
        reminders: ['Bài thi mẫu: Part 5', 'Ôn từ vựng chủ đề Travel'],
        status: 'Mở đăng ký'
    },
    {
        id: 'c7',
        subject: 'TOEFL',
        course: 'TOEFL iBT Preparation',
        teacher: 'Lê Ngọc E',
        room: 'P402',
        schedule: 'T3-T5 18:00-20:00',
        reminders: ['Viết essay: Agree/Disagree', 'Nghe lecture practice'],
        status: 'Đang học'
    },
    {
        id: 'c8',
        subject: 'Pronunciation',
        course: 'Phát âm chuẩn',
        teacher: 'Nguyễn Thị F',
        room: 'P203',
        schedule: 'T7-CN 09:00-11:00',
        reminders: ['Luyện âm /θ/', 'Ghi âm bài nói và nộp'],
        status: 'Tạm hoãn'
    }
];

function getContrastColor(hex) {
    const h = hex.replace('#', '');
    const hexFull = h.length === 3 ? h.split('').map(ch => ch + ch).join('') : h;
    const bigint = parseInt(hexFull, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 160 ? '#222' : '#fff';
}

function classifyReminder(textLower) {
    const urgentKeywords = ['nộp', 'hôm nay', 'gấp', 'khẩn', 'deadline', 'nộp hôm'];
    const soonKeywords = ['tuần', 'ngày mai', 'tuần tới', 'gần', 'sớm', 'trước giờ học'];

    for (const k of urgentKeywords) {
        if (textLower.includes(k)) return 'urgent';
    }
    for (const k of soonKeywords) {
        if (textLower.includes(k)) return 'soon';
    }
    return 'normal';
}

export default function CourseHome() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Tất cả');
    const filterOptions = ['Tất cả', 'Đang học', 'Đã học', 'Sắp mở'];

    const courses = useMemo(
        () =>
            rawCourses.map(c => ({
                ...c,
                headerColor: subjectColors[c.subject] || subjectColors.default,
                statusColor: statusColors[c.status] || statusColors.default
            })),
        []
    );

    const counts = useMemo(() => {
        const map = { 'Tất cả': rawCourses.length };
        ['Đang học', 'Đã học', 'Sắp mở'].forEach(k => {
            map[k] = rawCourses.filter(c => c.status === k).length;
        });
        return map;
    }, []);

    const visibleCourses = useMemo(() => {
        if (filter === 'Tất cả') return courses;
        return courses.filter(c => c.status === filter);
    }, [courses, filter]);

    const handleKeyActivate = (e, id) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            navigate(`/course/${id}`);
        }
    };

    return (
        <div className="course-wrapper">
            <div className="controls">
                <div className="filter-bar" role="toolbar" aria-label="Bộ lọc trạng thái lớp">
                    {filterOptions.map(opt => (
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

            <div className="course-grid p-4" role="list" aria-live="polite">
                <Tooltip target=".btn-tooltip" position="top" mouseTrack mouseTrackLeft={10} />

                {visibleCourses.map(c => {
                    const headerStyle = {
                        background: c.headerColor
                    };

                    const headerTextColor = getContrastColor(c.headerColor);

                    const footer = (
                        <div className="card-footer" aria-hidden="false" aria-label={`Hành động cho ${c.course}`}>
                            <Button
                                icon="pi pi-folder"
                                className="p-button-text p-button-rounded footer-btn btn-tooltip"
                                data-pr-tooltip="Tài liệu"
                                aria-label={`Tài liệu ${c.course}`}
                                onClick={e => e.stopPropagation()}
                                title="Tài liệu"
                            />
                            <Button
                                icon="pi pi-ellipsis-v"
                                className="p-button-text p-button-rounded footer-btn btn-tooltip"
                                data-pr-tooltip="Thêm"
                                aria-label={`Thêm ${c.course}`}
                                onClick={e => e.stopPropagation()}
                                title="Thêm"
                            />
                        </div>
                    );

                    return (
                        <Card
                            key={c.id}
                            className="course-card"
                            header={
                                <div className="card-header" style={headerStyle}>
                                    <div className="header-text" style={{ color: headerTextColor }}>
                                        <h3 className="title" title={c.subject}>
                                            {c.subject}
                                        </h3>
                                        <p className="subtitle" title={c.course}>
                                            {c.course}
                                        </p>

                                        <div className="header-meta">
                                            <div className="meta-row">
                                                <i className="pi pi-user" aria-hidden="true" />
                                                <div className="meta-text">
                                                    <strong className="meta-label">GV:</strong>
                                                    <span className="meta-value meta-teacher">{c.teacher}</span>
                                                </div>
                                            </div>

                                            <div className="meta-row">
                                                <i className="pi pi-clock" aria-hidden="true" />
                                                <span className="meta-value meta-schedule">{c.schedule}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="room-badge" aria-hidden="true" style={{ color: headerTextColor }}>
                                        {c.room}
                                    </div>
                                </div>
                            }
                            footer={footer}
                            onClick={() => navigate(`/course/${c.id}`)}
                            role="listitem"
                            tabIndex={0}
                            onKeyDown={e => handleKeyActivate(e, c.id)}
                            aria-label={`${c.subject} - ${c.course}`}
                        >
                            <div className="card-body">
                                <div className="body-info" aria-live="polite">
                                    <strong className="reminder-title">Nhắc nhở / Bài tập</strong>

                                    <ul className="reminder-list" aria-label={`Nhắc nhở của ${c.course}`}>
                                        {c.reminders && c.reminders.length > 0 ? (
                                            c.reminders.map((r, idx) => {
                                                const txt = String(r);
                                                const type = classifyReminder(txt.toLowerCase());
                                                const icon =
                                                    type === 'urgent'
                                                        ? 'pi pi-exclamation-triangle'
                                                        : type === 'soon'
                                                            ? 'pi pi-clock'
                                                            : 'pi pi-exclamation-circle';
                                                return (
                                                    <li
                                                        className={`reminder-item reminder-${type}`}
                                                        key={idx}
                                                        title={txt}
                                                    >
                                                        <i className={icon} aria-hidden="true" />
                                                        <span className="reminder-text">{txt}</span>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li className="reminder-item">
                                                <span className="reminder-text">Không có nhắc nhở</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div
                                    className="status-badge status-bottom"
                                    style={{
                                        background: c.statusColor,
                                        color: getContrastColor(c.statusColor)
                                    }}
                                    aria-label={`Trạng thái: ${c.status}`}
                                    title={c.status}
                                >
                                    {c.status}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
