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

const PaymentCancelled = () => {
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
        }
    }, [txnRef]);

    const loadPaymentResult = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(urls.resultPayment(txnRef));

            console.log("📌 Payment Cancelled API:", response.data);

            const data = response.data?.result || response.data?.data || response.data;
            setResult(data);

        } catch (error) {
            console.error('❌ Lỗi khi tải kết quả thanh toán:', error);
            // Tạo result object từ URL params nếu API fail
            setResult({
                txnRef: txnRef,
                status: 'CANCELLED',
                message: 'You have cancelled the transaction'
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

    const handleExploreCourses = () => {
        navigate('/courses');
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
                <Card className="text-center bg-yellow-50 border-2 border-yellow-200">
                    <div className="space-y-6">
                        {/* Cancelled Header */}
                        <div className="text-center">
                            <div className="text-8xl mb-4">⚠️</div>
                            <h1 className="text-4xl font-bold text-yellow-600 mb-2">
                                Payment Cancelled
                            </h1>
                            <p className="text-lg text-gray-600">
                                You have cancelled the payment transaction.
                            </p>
                        </div>

                        {/* Info Message */}
                        <Message
                            severity="warn"
                            text="Transaction has been cancelled. The course was not registered. You can try again at any time."
                            className="w-full"
                        />

                        <Divider />

                        {/* Transaction Details */}
                        {result && (
                            <div className="text-left space-y-4">
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    Transaction Details
                                </h3>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                        <span className="font-medium text-gray-700">Transaction ID:</span>
                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                            {result.txnRef}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                                        <span className="font-medium text-gray-700">Status:</span>
                                        <Tag value="CANCELLED" severity="warning" />
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
                                    label="Try Again"
                                    icon="pi pi-refresh"
                                    className="p-button-warning p-button-lg"
                                    onClick={handleRetryPayment}
                                />
                                <Button
                                    label="Explore Other Courses"
                                    icon="pi pi-search"
                                    className="p-button-outlined p-button-warning p-button-lg"
                                    onClick={handleExploreCourses}
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

                        {/* Encouragement Info */}
                        <div className="bg-blue-50 p-4 rounded-lg text-left">
                            <h4 className="font-semibold text-blue-800 mb-2">🎓 Don't miss your learning opportunity!</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• The course is still waiting for you</li>
                                <li>• 100% safe and secure payment</li>
                                <li>• 24/7 learning support</li>
                                <li>• Certificate after completion</li>
                            </ul>
                            <p className="text-sm text-blue-700 mt-2 font-medium">
                                Ready to start your learning journey? 🚀
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentCancelled;
