import React from 'react';
import { Divider } from 'primereact/divider';
import { currency } from '@/features/payment/utils/money';

export default function TotalsBox({ basePrice, discountAmount, totalPay }) {
    return (
        <div className="total-card">
            <div className="total-row">
                <span>Học phí gốc:</span>
                <b>{currency(basePrice)}</b>
            </div>
            <div className="total-row">
                <span>Giảm giá:</span>
                <b className="disc">-{currency(discountAmount)}</b>
            </div>
            <Divider />
            <div className="total-row big">
                <span>Tổng thanh toán:</span>
                <span className="grand">{currency(totalPay)}</span>
            </div>
        </div>
    );
}
