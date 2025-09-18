import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

const formatPrice = (v = 0) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const SubjectHero = ({ subject }) => {
    if (!subject) return null;

    return (
        <Card className="mb-4">
            <div className="grid">
                <div className="col-12 md:col-4">
                    <img
                        src={subject.image || '/noimg.png'}
                        alt={subject.title}
                        className="w-full h-15rem object-cover border-round"
                    />
                </div>
                <div className="col-12 md:col-8">
                    <h1 className="text-4xl font-bold text-900 mb-3">{subject.title}</h1>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <Tag value={`${subject.sessionNumber} buổi học`} severity="info" />
                        <Tag value={formatPrice(subject.fee)} severity="success" />
                        {subject.age ? <Tag value={`Độ tuổi: ${subject.age}`} severity="warning" /> : null}
                    </div>
                    <p className="text-lg text-700 mb-0">
                        Môn học được thiết kế chuyên biệt để phát triển kỹ năng một cách bài bản và hiệu quả.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default SubjectHero;
