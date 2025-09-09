// src/features/enrollment/components/ConfirmBox.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';

const ConfirmBox = ({ selectedItem, formatPrice }) => {
    if (!selectedItem) return null;
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Xác Nhận Thông Tin</h2>
            <Card className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <h3 className="text-xl font-bold text-primary mb-2">{selectedItem.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Tag value={selectedItem.type === 'program' ? 'Chương trình' : 'Môn học'} severity="info" />
                            {selectedItem.schedule && <Tag value={selectedItem.schedule} severity="warning" />}
                        </div>
                        <p><strong>Khai giảng:</strong> {selectedItem.startDate}</p>
                        {selectedItem.meta?.totalHours && <p><strong>Tổng số giờ:</strong> {selectedItem.meta.totalHours} giờ</p>}
                        {selectedItem.meta?.sessions && <p><strong>Số buổi học:</strong> {selectedItem.meta.sessions} buổi</p>}
                    </div>
                    <div className="col-12 md:col-4 text-right">
                        <div className="text-3xl font-bold text-primary">{formatPrice(selectedItem.price)}</div>
                        <div className="text-green-600 font-semibold">Ưu đãi: Giảm 10% cho đăng ký sớm</div>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default ConfirmBox;
