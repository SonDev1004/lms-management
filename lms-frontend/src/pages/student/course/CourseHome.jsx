import React, { useMemo } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useNavigate } from 'react-router-dom';
import '../../course/CourseHome.css';

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

const avatarPalette = [
    '#ff7043', '#7e57c2', '#ef5350', '#8d6e63', '#26a69a',
    '#29b6f6', '#ffb300', '#9ccc65'
];

const getPaletteColor = (idx) => avatarPalette[idx % avatarPalette.length];

const rawCourses = [
    { id: 'c1', subject: 'IELTS', course: 'IELTS Intermediate', teacher: 'Ngô Tồng Quốc', room: 'P101', schedule: 'T2-T4 18:00-20:00' },
    { id: 'c2', subject: 'IELTS', course: 'IELTS Foundation', teacher: 'Ngân Đặng Hà Thanh', room: 'P202', schedule: 'T3-T5 08:00-10:00' },
    { id: 'c3', subject: 'Tiếng Anh Giao Tiếp', course: 'Giao tiếp nâng cao', teacher: 'Nguyễn Văn A', room: 'P303', schedule: 'T7-CN 14:00-16:00' },
    { id: 'c4', subject: 'Tiếng Anh Thiếu Nhi', course: 'Starters Movers Flyers', teacher: 'Lê Thị B', room: 'P105', schedule: 'T2-T6 17:00-18:30' },
    { id: 'c5', subject: 'Business English', course: 'Thương mại nâng cao', teacher: 'Phạm Văn C', room: 'P201', schedule: 'T3-T5 19:00-21:00' },
    { id: 'c6', subject: 'TOEIC', course: 'TOEIC 500+', teacher: 'Trần Văn D', room: 'P401', schedule: 'T2-T4-T6 08:00-09:30' },
    { id: 'c7', subject: 'TOEFL', course: 'TOEFL iBT Preparation', teacher: 'Lê Ngọc E', room: 'P402', schedule: 'T3-T5 18:00-20:00' },
    { id: 'c8', subject: 'Pronunciation', course: 'Phát âm chuẩn', teacher: 'Nguyễn Thị F', room: 'P203', schedule: 'T7-CN 09:00-11:00' },
];

export default function CourseHome() {
    const navigate = useNavigate();

    const courses = useMemo(
        () =>
            rawCourses.map((c, i) => ({
                ...c,
                avatarText: c.subject.charAt(0).toUpperCase(),
                headerColor: subjectColors[c.subject] || subjectColors['default'],
                avatarColor: getPaletteColor(i),
            })),
        []
    );

    const handleKeyActivate = (e, id) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            navigate(`/course/${id}`);
        }
    };

    return (
        <div className="course-grid p-4">
            <Tooltip target=".btn-tooltip" position="top" mouseTrack mouseTrackLeft={10} />

            {courses.map((c) => {
                const header = (
                    <div className="card-header" style={{ background: c.headerColor }}>
                        <div className="header-text">
                            <h3 className="title" title={c.subject}>{c.subject}</h3>
                            <p className="subtitle" title={c.course}>{c.course}</p>

                            <div className="header-meta">
                                <div className="meta-row">
                                    <i className="pi pi-user" aria-hidden="true" />
                                    <div className="meta-text">
                                        <strong className="meta-label">GV:</strong>
                                        <span className="meta-value">{c.teacher}</span>
                                    </div>
                                </div>

                                {/* SỬA: lịch học hiển thị như pill với icon + text trên một dòng */}
                                <div className="meta-row">
                                    <i className="pi pi-calendar" aria-hidden="true" />
                                    <span className="meta-value">{c.schedule}</span>
                                </div>
                            </div>
                        </div>

                        <div className="room-badge" aria-hidden="true">{c.room}</div>

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
                        <Button
                            icon="pi pi-camera"
                            className="p-button-text p-button-rounded footer-btn btn-tooltip"
                            data-pr-tooltip="Ảnh lớp"
                            aria-label={`Ảnh lớp ${c.course}`}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            icon="pi pi-folder"
                            className="p-button-text p-button-rounded footer-btn btn-tooltip"
                            data-pr-tooltip="Tài liệu"
                            aria-label={`Tài liệu ${c.course}`}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            icon="pi pi-ellipsis-v"
                            className="p-button-text p-button-rounded footer-btn btn-tooltip"
                            data-pr-tooltip="Thêm"
                            aria-label={`Thêm ${c.course}`}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                );

                return (
                    <Card
                        key={c.id}
                        className="course-card"
                        header={header}
                        footer={footer}
                        onClick={() => navigate(`/course/${c.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => handleKeyActivate(e, c.id)}
                        aria-label={`${c.subject} - ${c.course}`}
                    >
                        <div className="card-body">
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
