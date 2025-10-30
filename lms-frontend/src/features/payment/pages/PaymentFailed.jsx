import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
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
                message: reason || 'Transaction failed'
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
                state: { selectedItem: courseInfo }
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
                <ProgressSpinner />
                <span className="ml-3">Loading payment result...</span>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Toast ref={toast} />

            <div className="max-w-2xl mx-auto">
                <Card className="text-center bg-red-50 border-2 border-red-200">
                    <div className="space-y-6">
                        {/* Failed Header */}
                        <div className="text-center">
                            <div className="text-8xl mb-4">❌</div>
                            <h1 className="text-4xl font-bold text-red-600 mb-2">
                                Payment Failed
                            </h1>
                            <p className="text-lg text-gray-600">
                                Sorry! Your transaction could not be completed.
                            </p>
                        </div>

                        {/* Error Message */}
                        {(result?.message || reason) && (
                            <Message
                                severity="error"
                                text={result?.message || reason || 'Transaction failed'}
                                className="w-full"
                            />
                        )}

                        <Divider />

                        {/* Transaction Details */}
                        {result && (
                            <div className="text-left space-y-4">
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    Transaction Details
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
                                        <Tag value="FAILED" severity="danger" />
                                    </div>

                                    {(result.programName || result.subjectName) && (
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700">Course:</span>
                                            <span className="text-right font-medium text-blue-600">
                                                {result.programName || result.subjectName}
                                            </span>
                                        </div>
                                    )}

                                    {result.totalFee && (
                                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                            <span className="font-medium text-gray-700">Amount:</span>
                                            <span className="font-bold text-gray-600">
                                                {formatPrice(result.totalFee)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Divider />

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <div className="flex justify-center gap-3 flex-wrap">
                                <Button
                                    label="Try Payment Again"
                                    icon="pi pi-refresh"
                                    className="p-button-danger p-button-lg"
                                    onClick={handleRetryPayment}
                                />
                                <Button
                                    label="Contact Support"
                                    icon="pi pi-phone"
                                    className="p-button-outlined p-button-danger p-button-lg"
                                    onClick={handleContactSupport}
                                />
                            </div>

                            <div className="text-center">
                                <Button
                                    label="Back to Home"
                                    icon="pi pi-home"
                                    className="p-button-text"
                                    onClick={handleBackToHome}
                                />
                            </div>
                        </div>

                        {/* Help Info */}
                        <div className="bg-yellow-50 p-4 rounded-lg text-left">
                            <h4 className="font-semibold text-yellow-800 mb-2">💡 Some possible reasons:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Insufficient account balance</li>
                                <li>• Incorrect card information</li>
                                <li>• Unstable network connection</li>
                                <li>• The bank refused the transaction</li>
                            </ul>
                            <p className="text-sm text-yellow-700 mt-2">
                                Please check again or contact your bank.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentFailed;
