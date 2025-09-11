// src/features/subject/pages/SubjectDetail.jsx
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import { subjects } from '@/mocks/homeDataMock.js';

import { SubjectHero, SubjectOutline, SubjectClassTable } from '../components';

const SubjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const subject = subjects?.[id];

    if (!subject) {
        return (
            <div className="p-6 text-center">
                <h2>Không tìm thấy môn học</h2>
                <Button label="Về trang chủ" onClick={() => navigate('/')} />
            </div>
        );
    }

    const USE_CHECKOUT = false; // bật true khi có trang /checkout

    const handleRegister = (courseId, className, schedule, startDate) => {
        // (tuỳ chọn) kiểm tra lại courseId có tồn tại không
        const selectedClass = subject.classes?.find(c => c.courseId === courseId);
        if (!selectedClass) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Không tìm thấy lớp',
                detail: 'Vui lòng chọn lại.'
            });
            return;
        }

        const payload = {
            type: 'subject',
            subjectId: subject.id,
            courseId,
            title: `${subject.title} - ${className}`,
            price: subject.price || 0,
            startDate,
            schedule,
            meta: { sessions: subject.sessions, age: subject.age }
        };

        // 👉 Điều hướng sang trang Đăng ký (enrollment)
        navigate('/dang-ky', { state: { selectedItem: payload } });
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <div className="max-w-6xl mx-auto">
                <SubjectHero subject={subject} />
                <SubjectOutline outline={subject.outline} />
                <SubjectClassTable classes={subject.classes} onRegister={handleRegister} />
            </div>
        </div>
    );
};

export default SubjectDetail;
