import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import urls from "@/shared/constants/urls.js";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const txnRef = searchParams.get("txnRef");
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (txnRef) {
            axios.get(urls.resultPayment(txnRef))   // ✅ phải truyền txnRef
                .then(res => setResult(res.data.result))
                .catch(err => console.error(err));
        }
    }, [txnRef]);

    if (!result) return <p>Đang kiểm tra kết quả...</p>;

    return (
        <div>
            <h1>Kết quả thanh toán</h1>
            <p>Mã giao dịch: {result.txnRef}</p>
            <p>Trạng thái: {result.status}</p>
            <p>Số tiền: {result.totalFee} {result.currency}</p> {/* ✅ dùng totalFee */}
            {result.status === "SUCCESS" && (
                <p>Đăng ký thành công! Mã enrollment: {result.enrollmentId}</p>
            )}
            {result.status !== "SUCCESS" && (
                <p>Thanh toán không thành công. Vui lòng thử lại.</p>
            )}
        </div>
    );
}
