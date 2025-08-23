import React, { useMemo } from 'react';
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
    const navigate = useNavigate();

    const courses = useMemo(
        () =>
            rawCourses.map((c) => ({
                id: c.id,
                title: `${c.code} - ${c.name} - ${c.semester}`.trim().replace(/- $/, ''), // xoá "-" nếu trống
                subtitle: c.teacher,
                avatarText: c.code.charAt(0).toUpperCase(),
                headerColor: getRandomColor(headerColors),
                avatarColor: getRandomColor(avatarColors),
            })),
        []
    );

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
                        <Avatar
                            label={c.avatarText}
                            size="large"
                            shape="circle"
                            className="header-avatar"
                            style={{ background: c.avatarColor, color: '#fff' }}
                        />
                    </div>

                    <div className="card-body" />

                    <div className="card-footer">
                        <Button
                            icon="pi pi-camera"
                            className="p-button-text p-button-rounded footer-btn"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            icon="pi pi-folder"
                            className="p-button-text p-button-rounded footer-btn"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                            icon="pi pi-ellipsis-v"
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
