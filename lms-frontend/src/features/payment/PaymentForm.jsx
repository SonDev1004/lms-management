import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {Divider} from 'primereact/divider';
import {Toast} from 'primereact/toast';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Tag} from 'primereact/tag';
import {Chip} from 'primereact/chip';
import axiosClient from '@/shared/api/axiosClient.js';
import urls from '@/shared/constants/urls.js';

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        notes: ''
    });

    const selectedItem = location.state?.selectedItem;

    useEffect(() => {
        if (!selectedItem) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Không có dữ liệu',
                detail: 'Vui lòng chọn khóa học để đăng ký.',
            });
            navigate('/');
            return;
        }

        loadUserProfile();
    }, [selectedItem, navigate]);

    const generateTxnRef = () => {
        return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const loadUserProfile = async () => {
        try {
            setProfileLoading(true);
            const response = await axiosClient.get(urls.profile);

            console.log("📌 Profile API:", response.data);

            // Kiểm tra structure của response
            const profile = response.data?.result || response.data?.data || response.data;

            // Ghép firstName + lastName thành fullName
            const fullName = [profile.firstName, profile.lastName]
                .filter(Boolean) // Loại bỏ null/undefined/empty
                .join(' ') // Nối với khoảng trắng
                .trim(); // Xóa khoảng trắng thừa

            setFormData({
                fullName: fullName || profile.username || '', // Fallback sang username nếu không có name
                email: profile.email || '',
                phone: profile.phone || '',
                notes: ''
            });
        } catch (error) {
            console.error('❌ Lỗi khi tải profile:', error);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Không thể tải thông tin người dùng.';

            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: errorMessage,
            });

            if (error.response?.status === 401) {
                setTimeout(() => navigate('/login'), 2000);
            }
        } finally {
            setProfileLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Thiếu thông tin',
                detail: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
            });
            return;
        }

        setLoading(true);

        try {
            const txnRef = generateTxnRef();
            const payload = {
                programId: selectedItem.type === 'program' ? selectedItem.programId : null,
                subjectId: selectedItem.type === 'subject' ? selectedItem.subjectId : null,
                totalFee: selectedItem.price,
                txnRef: txnRef
            };

            console.log('Sending payload to backend:', payload);

            const res = await axiosClient.post(urls.payment, payload);

            console.log("📌 API Response:", res.data);

            if (res.data?.result?.paymentUrl) {
                // Redirect đến VNPay
                window.location.href = res.data.result.paymentUrl;
            } else {
                // Nếu không có payment URL
                toast.current?.show({
                    severity: 'success',
                    summary: 'Đăng ký thành công',
                    detail: res.data?.result?.message || 'Bạn đã đăng ký thành công.',
                });

                setTimeout(() => {
                    navigate('/my-enrollments');
                }, 2000);
            }

        } catch (error) {
            console.error('❌ Lỗi khi tạo thanh toán:', error);

            const errorData = error.response?.data;
            let errorMessage = 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.';

            if (errorData?.message) {
                errorMessage = errorData.message;
            }

            toast.current?.show({
                severity: 'error',
                summary: 'Đăng ký thất bại',
                detail: errorMessage,
            });

            if (error.response?.status === 401) {
                setTimeout(() => navigate('/login'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusSeverity = (status) => {
        switch (status?.toLowerCase()) {
            case 'sắp khai giảng':
                return 'info';
            case 'đang học':
                return 'success';
            case 'đã kết thúc':
                return 'secondary';
            default:
                return 'info';
        }
    };

    if (!selectedItem) {
        return null;
    }

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner/>
                <span className="ml-3">Đang tải thông tin người dùng...</span>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Toast ref={toast}/>

            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <Button
                        icon="pi pi-arrow-left"
                        label="Quay lại"
                        className="p-button-text"
                        onClick={() => navigate(-1)}
                    />
                </div>

                <h2 className="text-3xl font-bold mb-6">Đăng ký khóa học</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Thông tin khóa học */}
                    <Card title="Thông tin khóa học" className="h-fit">
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-lg mb-2">{selectedItem.title}</h4>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatPrice(selectedItem.price)}
                                </div>
                            </div>

                            <Divider/>

                            {selectedItem.type === 'subject' && selectedItem.meta?.subject && (
                                <div>
                                    <h5 className="font-medium mb-2">Thông tin môn học:</h5>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Mã môn:</strong> {selectedItem.meta.subject.code}</p>
                                        <p><strong>Số buổi học:</strong> {selectedItem.meta.subject.sessionNumber}</p>
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === 'subject' && selectedItem.meta?.class && (
                                <div>
                                    <h5 className="font-medium mb-2">Thông tin lớp học:</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Lịch học:</span>
                                            <Chip label={selectedItem.meta.class.schedule} className="text-xs"/>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ngày khai giảng:</span>
                                            <span>{new Date(selectedItem.meta.class.startDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sĩ số:</span>
                                            <span>{selectedItem.meta.class.capacity} học viên</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Trạng thái:</span>
                                            <Tag
                                                value={selectedItem.meta.class.statusName}
                                                severity={getStatusSeverity(selectedItem.meta.class.statusName)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedItem.type === 'program' && selectedItem.meta?.track && (
                                <div>
                                    <h5 className="font-medium mb-2">Thông tin chương trình:</h5>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Lịch học:</strong> {selectedItem.meta.track.label}</p>
                                        <p><strong>Số khóa học:</strong> {selectedItem.meta.aggregate?.courseCount}</p>
                                        <p><strong>Tổng số buổi:</strong> {selectedItem.meta.aggregate?.totalSessions}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Form đăng ký */}
                    <Card title="Thông tin đăng ký">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full"
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <InputText
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Ghi chú
                                </label>
                                <InputTextarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    className="w-full"
                                    rows={3}
                                    placeholder="Nhập ghi chú (nếu có)"
                                />
                            </div>

                            <Divider/>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Tổng thanh toán:</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {formatPrice(selectedItem.price)}
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    label={loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                                    icon={loading ? '' : 'pi pi-check'}
                                    className="p-button-lg"
                                    disabled={loading}
                                />

                                {loading && <ProgressSpinner size="20px"/>}
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;