import React from 'react';
import {RadioButton} from 'primereact/radiobutton';
import {PM} from '@/features/payment/constants/payment';

export default function PaymentMethodPills() {

    return (
        <div className="p-field">
            <div className="pay-methods">
                        <span className="pill-text">
                            {PM.ONLINE && 'Thanh toán qua VNpay'}
            </span>
            </div>
        </div>
    );
}
