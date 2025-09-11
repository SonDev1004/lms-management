import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const formatPrice = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const ProgramHero = ({ program, onConsult }) => {
    if (!program) return null;

    return (
        <Card className="mb-4">
            <div className="grid">
                <div className="col-12 md:col-4">
                    <img
                        src={program.cover}
                        alt={program.title}
                        className="w-full h-15rem object-cover border-round"
                    />
                </div>
                <div className="col-12 md:col-8">
                    <h1 className="text-4xl font-bold text-900 mb-3">{program.title}</h1>
                    <p className="text-lg text-700 line-height-3 mb-4">{program.description}</p>
                    <div className="flex flex-wrap gap-3 mb-4">
                        <Tag value={`${program.totalHours} giờ học`} severity="info" />
                        <Tag value={formatPrice(program.price)} severity="success" />
                    </div>
                    <Button label="Nhận tư vấn miễn phí" icon="pi pi-phone" outlined onClick={onConsult} />
                </div>
            </div>
        </Card>
    );
};

export default ProgramHero;
