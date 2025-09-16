import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "@/shared/api/axiosClient";
import urls from "@/shared/constants/urls";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        const txnRef = searchParams.get("txnRef");
        if (txnRef) {
            axiosClient.get(`${urls.vnpayReturn}?txnRef=${txnRef}`)
                .then(res => setTransaction(res.data.result))
                .catch(err => console.error(err));
        }
    }, [searchParams]);

    return (
        <div>
            <h1>Thanh toán thành công</h1>
            {transaction ? (
                <div>
                    <p>Mã giao dịch: {transaction.txnRef}</p>
                    <p>Số tiền: {transaction.amount} VND</p>
                    <p>Trạng thái: {transaction.status}</p>
                </div>
            ) : (
                <p>Đang tải thông tin giao dịch...</p>
            )}
        </div>
    );
};

export default PaymentSuccess;
