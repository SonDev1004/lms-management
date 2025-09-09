// src/features/enrollment/components/OrderSummary.jsx
import React from 'react';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';

const paymentOptions = [
    { label: 'VNPay', value: 'vnpay', icon: 'pi pi-credit-card' },
    { label: 'MoMo', value: 'momo', icon: 'pi pi-mobile' },
    { label: 'ZaloPay', value: 'zalopay', icon: 'pi pi-wallet' },
    { label: 'Visa/Master', value: 'visa', icon: 'pi pi-credit-card' },
    { label: 'Chuyển khoản', value: 'bank', icon: 'pi pi-building' },
    { label: 'Tiền mặt', value: 'cash', icon: 'pi pi-money-bill' },
];

const itemTemplate = (option) => (
    <div className="flex align-items-center gap-2">
        <i className={`${option.icon}`} />
        <span>{option.label}</span>
    </div>
);

const OrderSummary = ({
                          selectedItem,
                          formatPrice,
                          discount = 0.1,
                          onBack,
                          onSubmit,
                          paymentMethod,        // <-- thêm
                          onPaymentChange,      // <-- thêm
                      }) => {
    if (!selectedItem) return null;
    const price = selectedItem.price || 0;
    const total = price * (1 - discount);

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Hoàn Tất Đăng Ký</h2>

            {/* Chọn phương thức thanh toán */}
            <Card className="mb-4">
                <h3 className="text-lg font-bold mb-3">Phương thức thanh toán</h3>
                <SelectButton
                    value={paymentMethod}
                    onChange={(e) => onPaymentChange?.(e.value)}
                    options={paymentOptions}
                    optionLabel="label"
                    optionValue="value"
                    itemTemplate={itemTemplate}
                    className="w-full"
                />
                <div className="mt-3 text-700 text-sm">
                    {paymentMethod === 'vnpay' && (
                        <span>
              <i className="pi pi-info-circle mr-2" />
              Thanh toán VNPay: hệ thống sẽ tạo mã thanh toán/QR hoặc chuyển hướng cổng VNPay (khi tích hợp thật).
            </span>
                    )}
                </div>
            </Card>

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
                {/* Hoàn tất đăng ký (chưa redirect payment thật) */}
                <Button label="Hoàn tất đăng ký" icon="pi pi-check-circle" onClick={() => onSubmit?.(paymentMethod)} />
            </div>
        </>
    );
};

export default OrderSummary;
