import React from "react";

const PaymentFailed = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl text-red-600">Thanh toán thất bại ❌</h2>
            <p className="mt-4">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
    );
};

export default PaymentFailed;
