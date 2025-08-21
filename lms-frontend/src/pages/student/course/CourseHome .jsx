import React, { useMemo } from 'react';
<<<<<<< Updated upstream
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
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
=======
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './CourseHome.css';


const headerColors = [
    '#3f51b5', '#5d6d23', '#00897b', '#37474f', '#ef5350',
    '#8e24aa', '#0277bd', '#f57c00', '#7b1fa2', '#388e3c',
    '#d32f2f', '#1976d2', '#512da8', '#c2185b', '#0097a7',
    '#afb42b', '#e64a19', '#5d4037', '#455a64', '#43a047'
];

const avatarColors = [
    '#f4511e', '#5c6bc0', '#c2185b', '#2e4a09', '#0d47a1',
    '#ff9800', '#009688', '#8bc34a', '#9c27b0', '#03a9f4',
    '#e91e63', '#673ab7', '#795548', '#607d8b', '#ff5722',
    '#4caf50', '#2196f3', '#ffc107', '#9e9e9e', '#00bcd4'
];

const getRandomColor = (colors) => colors[Math.floor(Math.random() * colors.length)];

const rawCourses = [
    { id: 'c1', code: 'C2304L1', name: 'Lập Trình Java', semester: 'SEM 1', teacher: 'Aptech Phong Dao Tao' },
    { id: 'c2', code: 'SGIELT573', name: 'IELTS Intermediate', semester: '2023', teacher: 'Ngô Tồng Quốc' },
    { id: 'c3', code: 'SGIELT576', name: 'IELTS Foundation', semester: '2023', teacher: 'Ngân Đặng Hà Thanh (09:00-12:00)' },
    { id: 'c4', code: 'ACCP2306+2309', name: 'Java EE', semester: 'SEM 3', teacher: 'KASE QLĐT' },
    { id: 'c5', code: 'ACCP2306', name: 'Java', semester: 'SEM 2', teacher: 'KASE QLĐT' },
    { id: 'c6', code: 'ACCP2306', name: 'C# .NET', semester: 'SEM 1', teacher: 'KASE QLĐT' },
    { id: 'c7', code: '9A-B', name: 'Tiếng Anh', semester: '2022-2023', teacher: 'Studyspace TA' },
    { id: 'c8', code: 'SGI', name: 'Extra Class', semester: '', teacher: 'Example Subtitle' },
];

const CourseHome = () => {
>>>>>>> Stashed changes
    const navigate = useNavigate();

    const courses = useMemo(
        () =>
<<<<<<< Updated upstream
            rawCourses.map((c, i) => ({
                ...c,
                avatarText: c.subject.charAt(0).toUpperCase(),
                headerColor: subjectColors[c.subject] || subjectColors['default'],
                avatarColor: getPaletteColor(i),
=======
            rawCourses.map((c) => ({
                id: c.id,
                title: `${c.code} - ${c.name} - ${c.semester}`.trim().replace(/- $/, ''), // xoá "-" nếu trống
                subtitle: c.teacher,
                avatarText: c.code.charAt(0).toUpperCase(),
                headerColor: getRandomColor(headerColors),
                avatarColor: getRandomColor(avatarColors),
>>>>>>> Stashed changes
            })),
        []
    );

<<<<<<< Updated upstream
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

=======
    return (
        <div className="course-grid p-4">
            {courses.map((c) => (
                <div
                    key={c.id}
                    className="course-card"
                    onClick={() => navigate(`/course/${c.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' ? navigate(`/course/${c.id}`) : null)}
                >
                    <div className="card-header" style={{ background: c.headerColor }}>
                        <div className="header-text">
                            <h3 className="title">{c.title}</h3>
                            <p className="subtitle">{c.subtitle}</p>
                        </div>
>>>>>>> Stashed changes
                        <Avatar
                            label={c.avatarText}
                            size="large"
                            shape="circle"
                            className="header-avatar"
                            style={{ background: c.avatarColor, color: '#fff' }}
                        />
                    </div>
<<<<<<< Updated upstream
                );

                const footer = (
                    <div className="card-footer">
                        <Button
                            icon="pi pi-camera"
                            className="p-button-text p-button-rounded footer-btn btn-tooltip"
                            data-pr-tooltip="Ảnh lớp"
                            aria-label={`Ảnh lớp ${c.course}`}
=======

                    <div className="card-body" />

                    <div className="card-footer">
                        <Button
                            icon="pi pi-camera"
                            className="p-button-text p-button-rounded footer-btn"
>>>>>>> Stashed changes
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            icon="pi pi-folder"
<<<<<<< Updated upstream
                            className="p-button-text p-button-rounded footer-btn btn-tooltip"
                            data-pr-tooltip="Tài liệu"
                            aria-label={`Tài liệu ${c.course}`}
=======
                            className="p-button-text p-button-rounded footer-btn"
>>>>>>> Stashed changes
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            icon="pi pi-ellipsis-v"
<<<<<<< Updated upstream
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
=======
                            className="p-button-text p-button-rounded footer-btn"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseHome;
>>>>>>> Stashed changes
