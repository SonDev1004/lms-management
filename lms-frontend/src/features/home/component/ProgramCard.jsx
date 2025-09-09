import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProgramCard = ({ program }) => {
    const navigate = useNavigate();

    return (
        <Card className="m-2 shadow-2 border-round-lg" style={{ minHeight: '300px' }}>
            <div className="text-center">
                <img
                    src={program.cover}
                    alt={program.title}
                    className="w-full h-8rem object-cover border-round mb-3"
                    loading="lazy"
                />
                <h4 className="text-900 font-bold mb-2">{program.title}</h4>
                {program.summary && <p className="text-600 mb-3 line-height-3">{program.summary}</p>}
                <div className="flex justify-content-between align-items-center mb-3">
                    <Tag value={`Từ ${formatPrice(program.priceFrom)}`} severity="success" />
                </div>
                <Button
                    label="Xem chi tiết"
                    icon="pi pi-arrow-right"
                    className="w-full"
                    onClick={() => navigate(`/program/${program.id}`)}
                />
            </div>
        </Card>
    );
};

export default ProgramCard;
