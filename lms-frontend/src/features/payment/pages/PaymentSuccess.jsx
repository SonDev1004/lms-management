import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Tag} from 'primereact/tag';
import {Divider} from 'primereact/divider';
import axiosClient from '@/shared/api/axiosClient.js';
import urls from '@/shared/constants/urls.js';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    const txnRef = searchParams.get('txnRef');

    useEffect(() => {
        if (txnRef) {
            loadPaymentResult();
        } else {
            setLoading(false);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không tìm thấy mã giao dịch.',
            });
        }
    }, [txnRef]);

    const loadPaymentResult = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(urls.resultPayment(txnRef));

            console.log("📌 Payment Success API:", response.data);

            const data = response.data?.result || response.data?.data || response.data;
            setResult(data);

            toast.current?.show({
                severity: 'success',
                summary: 'Thanh toán thành công',
                detail: data.message || 'Bạn đã đăng ký khóa học thành công!',
            });

        } catch (error) {
            console.error('❌ Lỗi khi tải kết quả thanh toán:', error);

            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tải thông tin giao dịch.',
            });
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

    const handleViewEnrollments = () => {
        navigate('/my-enrollments');
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleContinueLearning = () => {
        navigate('/courses');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ProgressSpinner/>
                <span className="ml-3">Đang tải kết quả thanh toán...</span>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Toast ref={toast}/>

            <div className="max-w-2xl mx-auto">
                <Card className="text-center bg-green-50 border-2 border-green-200">
                    <div className="space-y-6">
                        {/* Success Header */}
                        <div className="text-center">
                            <div className="text-8xl mb-4">🎉</div>
                            <h1 className="text-4xl font-bold text-green-600 mb-2">
                                Thanh toán thành công!
                            </h1>
                            <p className="text-lg text-gray-600">
                                Chúc mừng! Bạn đã đăng ký khóa học thành công.
                            </p>
                        </div>

                        <Divider/>

                        {/* Transaction Details */}
                        {result && (
                            <div className="text-left space-y-4">
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    Thông tin giao dịch
                                </h3>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                        <span className="font-medium text-gray-700">Mã giao dịch:</span>
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {result.txnRef}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                        <span className="font-medium text-gray-700">Trạng thái:</span>
                                        <Tag value="THÀNH CÔNG" severity="success"/>
                                    </div>

                                    {(result.programName || result.subjectName) && (
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700">Khóa học:</span>
                                            <span className="text-right font-medium text-blue-600">
                                                {result.programName || result.subjectName}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                        <span className="font-medium text-gray-700">Số tiền đã thanh toán:</span>
                                        <span className="font-bold text-green-600 text-lg">
                                            {formatPrice(result.totalFee)}
                                        </span>
                                    </div>

                                    {result.enrollmentId && (
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700">Mã đăng ký:</span>
                                            <span className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">
                                                #{result.enrollmentId}
                                            </span>
                                        </div>
                                    )}

                                    {result.orderInfo && (
                                        <div className="p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700 block mb-2">
                                                Thông tin đơn hàng:
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {result.orderInfo}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Divider/>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <div className="flex justify-center gap-3 flex-wrap">
                                <Button
                                    label="Xem khóa học đã đăng ký"
                                    icon="pi pi-book"
                                    className="p-button-success p-button-lg"
                                    onClick={handleViewEnrollments}
                                />
                                <Button
                                    label="Tiếp tục học"
                                    icon="pi pi-play"
                                    className="p-button-outlined p-button-success p-button-lg"
                                    onClick={handleContinueLearning}
                                />
                            </div>

                            <div className="text-center">
                                <Button
                                    label="Về trang chủ"
                                    icon="pi pi-home"
                                    className="p-button-text"
                                    onClick={handleBackToHome}
                                />
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-blue-50 p-4 rounded-lg text-left">
                            <h4 className="font-semibold text-blue-800 mb-2">📧 Bước tiếp theo:</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Kiểm tra email để nhận thông tin chi tiết về khóa học</li>
                                <li>• Truy cập vào mục "Khóa học của tôi" để bắt đầu học</li>
                                <li>• Liên hệ hỗ trợ nếu bạn có bất kỳ câu hỏi nào</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccess;
