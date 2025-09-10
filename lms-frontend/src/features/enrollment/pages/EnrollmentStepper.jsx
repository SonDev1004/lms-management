// src/features/enrollment/pages/EnrollmentStepper.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';

import ConfirmBox from '../components/ConfirmBox';
import StudentForm from '../components/StudentForm';
import OrderSummary from '../components/OrderSummary';

const EnrollmentStepper = () => {
    const toast = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (location.state?.selectedItem) setSelectedItem(location.state.selectedItem);
        else navigate('/'); // không có payload → quay về Home
    }, [location.state, navigate]);

    const formatPrice = (price = 0) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const validateForm = () => {
        const e = {};
        if (!formData.name.trim()) e.name = 'Vui lòng nhập họ tên';
        if (!formData.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
        else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) e.phone = 'Số điện thoại không hợp lệ';
        if (!formData.email.trim()) e.email = 'Vui lòng nhập email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email không hợp lệ';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const nextFromForm = () => {
        if (!validateForm()) return;
        setActiveIndex(2);
    };

    const handleSubmit = () => {
        toast.current?.show({ severity: 'success', summary: 'Đã nhận đăng ký', detail: 'Chúng tôi sẽ liên hệ bạn trong 24h' });
        navigate('/cam-on', {
            state: {
                orderInfo: {
                    ...selectedItem,
                    customerInfo: formData,
                    paymentMethod: 'pending', // chưa thanh toán
                    orderDate: new Date().toISOString(),
                    discount: 0.1
                }
            }
        });
    };

    // 👉 Đổi nhãn bước 3 thành “Hoàn tất” (không phải “Thanh toán”)
    const steps = [{ label: 'Xác nhận' }, { label: 'Thông tin' }, { label: 'Hoàn tất' }];

    if (!selectedItem) return null;

    return (
        <div className="p-4">
            <Toast ref={toast} />
            <div className="max-w-4xl mx-auto">
                <Card>
                    <h1 className="text-3xl font-bold text-center mb-4">Đăng Ký Khóa Học</h1>
                    <Steps model={steps} activeIndex={activeIndex} className="mb-6" />

                    {activeIndex === 0 && (
                        <>
                            <ConfirmBox selectedItem={selectedItem} formatPrice={formatPrice} />
                            <div className="text-center">
                                <button className="p-button p-component p-button-lg" onClick={() => setActiveIndex(1)}>
                                    <span className="p-button-label">Tiếp tục</span>
                                    <span className="p-button-icon p-c pi pi-arrow-right p-button-icon-right" />
                                </button>
                            </div>
                        </>
                    )}

                    {activeIndex === 1 && (
                        <StudentForm
                            formData={formData}
                            errors={errors}
                            setFormData={setFormData}
                            onBack={() => setActiveIndex(0)}
                            onNext={nextFromForm}
                        />
                    )}

                    {activeIndex === 2 && (
                        <OrderSummary
                            selectedItem={selectedItem}
                            formatPrice={formatPrice}
                            discount={0.1}
                            onBack={() => setActiveIndex(1)}
                            onSubmit={handleSubmit}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EnrollmentStepper;
