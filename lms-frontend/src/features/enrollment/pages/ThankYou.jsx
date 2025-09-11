// src/features/enrollment/pages/ThankYou.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const ThankYou = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderInfo = location.state?.orderInfo;

    const formatPrice = (price = 0) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    // Fallback nếu không có orderInfo (truy cập trực tiếp /cam-on)
    if (!orderInfo) {
        return (
            <div className="p-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="text-center">
                        <i className="pi pi-info-circle text-4xl text-500 mb-3"></i>
                        <h2 className="mb-3">Không có thông tin đăng ký</h2>
                        <Button label="Về Trang Chủ" icon="pi pi-home" onClick={() => navigate('/')} />
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto text-center">
                <Card>
                    <div className="mb-4">
                        <i className="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
                        <h1 className="text-4xl font-bold text-green-600 mb-2">Đăng Ký Thành Công!</h1>
                        <p className="text-xl text-700">Cảm ơn bạn đã tin tưởng và lựa chọn trung tâm của chúng tôi</p>
                    </div>

                    <div className="text-left mb-6">
                        <h2 className="text-2xl font-bold mb-4 text-center">Thông Tin Đăng Ký</h2>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <Card className="h-full bg-blue-50">
                                    <h3 className="text-lg font-bold text-primary mb-3">Thông tin khóa học</h3>
                                    <p><strong>Tên khóa học:</strong> {orderInfo.title}</p>
                                    <p>
                                        <strong>Loại:</strong>{' '}
                                        <Tag
                                            value={orderInfo.type === 'program' ? 'Chương trình' : 'Môn học'}
                                            severity="info"
                                            className="ml-2"
                                        />
                                    </p>
                                    <p><strong>Khai giảng:</strong> {orderInfo.startDate}</p>
                                    {orderInfo.schedule && <p><strong>Lịch học:</strong> {orderInfo.schedule}</p>}
                                    <p>
                                        <strong>Học phí:</strong>{' '}
                                        <span className="text-primary font-bold">
                      {formatPrice((orderInfo.price || 0) * 0.9)}
                    </span>
                                    </p>
                                </Card>
                            </div>

                            <div className="col-12 md:col-6">
                                <Card className="h-full bg-green-50">
                                    <h3 className="text-lg font-bold text-green-700 mb-3">Thông tin học viên</h3>
                                    <p><strong>Họ tên:</strong> {orderInfo.customerInfo?.name}</p>
                                    <p><strong>Điện thoại:</strong> {orderInfo.customerInfo?.phone}</p>
                                    <p><strong>Email:</strong> {orderInfo.customerInfo?.email}</p>
                                    <p>
                                        <strong>Phương thức thanh toán:</strong>{' '}
                                        <Tag
                                            value={orderInfo.paymentMethod?.toUpperCase?.()}
                                            severity="success"
                                            className="ml-2"
                                        />
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 border-round border-left-3 border-yellow-500 mb-6">
                        <h3 className="text-lg font-bold text-yellow-800 mt-0">Thông tin quan trọng</h3>
                        <div className="text-left text-yellow-700">
                            <p>📧 <strong>Thông tin chi tiết đã được gửi đến email:</strong> {orderInfo.customerInfo?.email}</p>
                            <p>📍 <strong>Địa điểm học:</strong> 123 Đường ABC, Quận 1, TP.HCM</p>
                            <p>📞 <strong>Hotline hỗ trợ:</strong> (028) 1234 5678</p>
                            <p>⏰ <strong>Vui lòng có mặt trước 15 phút trong buổi học đầu tiên</strong></p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-content-center gap-3">
                        <Button label="Về Trang Chủ" icon="pi pi-home" onClick={() => navigate('/')} size="large" />
                        <Button label="Xem Thêm Khóa Khác" icon="pi pi-search" outlined onClick={() => navigate('/')} size="large" />
                        <Button label="Liên Hệ Hỗ Trợ" icon="pi pi-phone" severity="help" outlined size="large" />
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border-round">
                        <h4 className="text-blue-900 mt-0">Bước tiếp theo</h4>
                        <div className="text-left text-blue-800">
                            <p>1. Kiểm tra email để xem thông tin chi tiết và tài liệu chuẩn bị</p>
                            <p>2. Tham gia group Zalo/Facebook của lớp (link trong email)</p>
                            <p>3. Chuẩn bị sách vở và có mặt đúng giờ trong buổi học đầu tiên</p>
                            <p>4. Liên hệ hotline nếu có bất kỳ thắc mắc nào</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ThankYou;
