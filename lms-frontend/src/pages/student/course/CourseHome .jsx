import React, { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './CourseHome.css';

const subjectColors = {
    'IELTS': '#1976d2',
    'TOEIC': '#f57c00',
    'TOEFL': '#0288d1',
    'Tiếng Anh Giao Tiếp': '#c2185b',
    'Tiếng Anh Thiếu Nhi': '#43a047',
    'Business English': '#5d4037',
    'Pronunciation': '#e64a19',
    'default': '#6a1b9a'
};

const avatarColors = [
    '#f4511e', '#5c6bc0', '#c2185b', '#2e4a09', '#0d47a1',
    '#ff9800', '#009688', '#8bc34a', '#9c27b0', '#03a9f4'
];
const getRandomColor = (colors) => colors[Math.floor(Math.random() * colors.length)];

const rawCourses = [
    { id: 'c1', subject: 'IELTS', course: 'IELTS Intermediate', teacher: 'Ngô Tồng Quốc', room: 'P101', schedule: 'T2-T4 18:00-20:00', sessions: '12 buổi', status: 'Đang học' },
    { id: 'c2', subject: 'IELTS', course: 'IELTS Foundation', teacher: 'Ngân Đặng Hà Thanh', room: 'P202', schedule: 'T3-T5 08:00-10:00', sessions: '10 buổi', status: 'Sắp khai giảng' },
    { id: 'c3', subject: 'Tiếng Anh Giao Tiếp', course: 'Giao tiếp nâng cao', teacher: 'Nguyễn Văn A', room: 'P303', schedule: 'T7-CN 14:00-16:00', sessions: '8 buổi', status: 'Đang học' },
    { id: 'c4', subject: 'Tiếng Anh Thiếu Nhi', course: 'Starters Movers Flyers', teacher: 'Lê Thị B', room: 'P105', schedule: 'T2-T6 17:00-18:30', sessions: '16 buổi', status: 'Đã xong' },
    { id: 'c5', subject: 'Business English', course: 'Thương mại nâng cao', teacher: 'Phạm Văn C', room: 'P201', schedule: 'T3-T5 19:00-21:00', sessions: '12 buổi', status: 'Đang học' },
    { id: 'c6', subject: 'TOEIC', course: 'TOEIC 500+', teacher: 'Trần Văn D', room: 'P401', schedule: 'T2-T4-T6 08:00-09:30', sessions: '20 buổi', status: 'Đang học' },
    { id: 'c7', subject: 'TOEFL', course: 'TOEFL iBT Preparation', teacher: 'Lê Ngọc E', room: 'P402', schedule: 'T3-T5 18:00-20:00', sessions: '14 buổi', status: 'Sắp khai giảng' },
    { id: 'c8', subject: 'Pronunciation', course: 'Phát âm chuẩn', teacher: 'Nguyễn Thị F', room: 'P203', schedule: 'T7-CN 09:00-11:00', sessions: '6 buổi', status: 'Đang học' },
];

const statusSlug = {
    'Đang học': 'dang-hoc',
    'Đã xong': 'da-xong',
    'Sắp khai giảng': 'sap-khai-giang'
};

const CourseHome = () => {
    const navigate = useNavigate();

    const courses = useMemo(
        () => rawCourses.map((c) => ({
            ...c,
            avatarText: c.subject.charAt(0).toUpperCase(),
            headerColor: subjectColors[c.subject] || subjectColors['default'],
            avatarColor: getRandomColor(avatarColors),
        })), []
    );

    return (
        <div className="course-grid p-4">
            {courses.map((c) => {
                const header = (
                    <div className="card-header" style={{ background: c.headerColor }}>
                        <div className="header-text">
                            <h3 className="title">{c.subject}</h3>
                            <p className="subtitle">{c.course}</p>

                            <div className="header-meta">
                                <div className="meta-row"><i className="pi pi-user" /> <span className="meta-text">GV: {c.teacher}</span></div>
                                <div className="meta-row"><i className="pi pi-map-marker" /> <span className="meta-text">Phòng: {c.room}</span></div>
                                <div className="meta-row"><i className="pi pi-calendar" /> <span className="meta-text">Lịch: {c.schedule}</span></div>
                            </div>
                        </div>

                        <Avatar
                            label={c.avatarText}
                            size="large"
                            shape="circle"
                            className="header-avatar"
                            style={{ background: c.avatarColor, color: '#fff' }}
                        />
                    </div>
                );

                const footer = (
                    <div className="card-footer">
                        <Button icon="pi pi-camera" className="p-button-text p-button-rounded footer-btn" title="Ảnh lớp" onClick={(e) => e.stopPropagation()} />
                        <Button icon="pi pi-folder" className="p-button-text p-button-rounded footer-btn" title="Tài liệu" onClick={(e) => e.stopPropagation()} />
                        <Button icon="pi pi-ellipsis-v" className="p-button-text p-button-rounded footer-btn" title="Thêm" onClick={(e) => e.stopPropagation()} />
                    </div>
                );

                const slug = statusSlug[c.status] || 'dang-hoc';

                return (
                    <Card
                        key={c.id}
                        className="course-card"
                        header={header}
                        footer={footer}
                        onClick={() => navigate(`/course/${c.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/course/${c.id}`); }}
                    >
                        <div className="card-body">
                            <div className="body-top">
                                <span className={`status-badge status-${slug}`}>{c.status}</span>
                            </div>

                            <div className="body-info">
                                <div><strong>Số buổi:</strong> {c.sessions}</div>
                                <div className="muted">Nhấn vào thẻ để xem chi tiết lớp</div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default CourseHome;
