import React, {useEffect, useRef, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {ProgressSpinner} from 'primereact/progressspinner';
import {Tag} from 'primereact/tag';
import {Divider} from 'primereact/divider';
import {Message} from 'primereact/message';
import axiosClient from '@/shared/api/axiosClient.js';
import urls from '@/shared/constants/urls.js';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    const txnRef = searchParams.get('txnRef');
    const reason = searchParams.get('reason');

    useEffect(() => {
        if (txnRef) {
            loadPaymentResult();
        } else {
            setLoading(false);
        }
    }, [txnRef]);

    const loadPaymentResult = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(urls.resultPayment(txnRef));

            console.log("📌 Payment Failed API:", response.data);

            const data = response.data?.result || response.data?.data || response.data;
            setResult(data);

        } catch (error) {
            console.error('❌ Lỗi khi tải kết quả thanh toán:', error);
            // Tạo result object từ URL params nếu API fail
            setResult({
                txnRef: txnRef,
                status: 'FAILED',
                message: reason || 'Giao dịch không thành công'
            });
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleRetryPayment = () => {
        if (result?.programId || result?.subjectId) {
            const courseInfo = {
                type: result.programId ? 'program' : 'subject',
                programId: result.programId,
                subjectId: result.subjectId,
                title: result.programName || result.subjectName,
                price: result.totalFee
            };

            navigate('/dang-ky-hoc', {
                state: {selectedItem: courseInfo}
            });
        } else {
            navigate('/courses');
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleContactSupport = () => {
        // Có thể navigate đến trang contact hoặc mở chat
        navigate('/contact');
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
                <Card className="text-center bg-red-50 border-2 border-red-200">
                    <div className="space-y-6">
                        {/* Failed Header */}
                        <div className="text-center">
                            <div className="text-8xl mb-4">❌</div>
                            <h1 className="text-4xl font-bold text-red-600 mb-2">
                                Thanh toán thất bại
                            </h1>
                            <p className="text-lg text-gray-600">
                                Rất tiếc! Giao dịch của bạn không thể hoàn tất.
                            </p>
                        </div>

                        {/* Error Message */}
                        {(result?.message || reason) && (
                            <Message
                                severity="error"
                                text={result?.message || reason || 'Giao dịch không thành công'}
                                className="w-full"
                            />
                        )}

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
                                        <Tag value="THẤT BẠI" severity="danger"/>
                                    </div>

                                    {(result.programName || result.subjectName) && (
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700">Khóa học:</span>
                                            <span className="text-right font-medium text-blue-600">
                                                {result.programName || result.subjectName}
                                            </span>
                                        </div>
                                    )}

                                    {result.totalFee && (
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700">Số tiền:</span>
                                            <span className="font-bold text-gray-600">
                                                {formatPrice(result.totalFee)}
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
                                    label="Thử thanh toán lại"
                                    icon="pi pi-refresh"
                                    className="p-button-danger p-button-lg"
                                    onClick={handleRetryPayment}
                                />
                                <Button
                                    label="Liên hệ hỗ trợ"
                                    icon="pi pi-phone"
                                    className="p-button-outlined p-button-danger p-button-lg"
                                    onClick={handleContactSupport}
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

                        {/* Help Info */}
                        <div className="bg-yellow-50 p-4 rounded-lg text-left">
                            <h4 className="font-semibold text-yellow-800 mb-2">💡 Một số nguyên nhân có thể:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Số dư tài khoản không đủ</li>
                                <li>• Thông tin thẻ không chính xác</li>
                                <li>• Kết nối mạng không ổn định</li>
                                <li>• Ngân hàng từ chối giao dịch</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">
                                Vui lòng kiểm tra lại hoặc liên hệ ngân hàng của bạn.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentFailed;
