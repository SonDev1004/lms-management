import React from "react";

const PaymentCancelled = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl text-yellow-600">Bạn đã hủy thanh toán ⚠️</h2>
            <p className="mt-4">Nếu bạn đổi ý, vui lòng đăng ký lại và tiến hành thanh toán.</p>
        </div>
    );
};

export default PaymentCancelled;
