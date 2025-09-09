// src/features/enrollment/components/OrderSummary.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

const OrderSummary = ({ selectedItem, formatPrice, discount = 0.1, onBack, onSubmit }) => {
    if (!selectedItem) return null;
    const price = selectedItem.price || 0;
    const total = price * (1 - discount);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Hoàn Tất Đăng Ký</h2>
            <div className="grid">
                <div className="col-12 md:col-8">
                    <Card className="bg-gray-50">
                        <h3 className="text-lg font-bold mb-3">Thông tin gói đăng ký</h3>
                        <p className="m-0"><strong>Tên:</strong> {selectedItem.title}</p>
                        {selectedItem.schedule && <p className="m-0"><strong>Lịch học:</strong> {selectedItem.schedule}</p>}
                        {selectedItem.startDate && <p className="m-0"><strong>Khai giảng:</strong> {selectedItem.startDate}</p>}
                    </Card>
                </div>

                <div className="col-12 md:col-4">
                    <Card className="bg-gray-50">
                        <h3 className="text-lg font-bold mb-3">Tóm tắt học phí</h3>
                        <div className="flex justify-content-between mb-2">
                            <span>Học phí:</span><span>{formatPrice(price)}</span>
                        </div>
                        <div className="flex justify-content-between mb-2 text-green-600">
                            <span>Giảm giá (10%):</span><span>-{formatPrice(price * discount)}</span>
                        </div>
                        <Divider />
                        <div className="flex justify-content-between text-xl font-bold">
                            <span>Tổng cộng:</span>
                            <span className="text-primary">{formatPrice(total)}</span>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="flex justify-content-between mt-4">
                <Button label="Quay lại" icon="pi pi-arrow-left" outlined onClick={onBack} />
                {/* 👉 Không có nút “Thanh toán ngay” — chỉ Hoàn tất đăng ký */}
                <Button label="Hoàn tất đăng ký" icon="pi pi-check-circle" onClick={onSubmit} />
            </div>
        </>
    );
};

export default OrderSummary;
