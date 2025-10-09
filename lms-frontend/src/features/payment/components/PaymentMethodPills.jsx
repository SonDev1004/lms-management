import React from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { PM } from '@/features/payment/constants/payment';

export default function PaymentMethodPills({ value, onChange }) {
    const options = [PM.CASH, PM.BANK_TRANSFER, PM.QR_CODE, PM.ONLINE];
    return (
        <div className="p-field">
            <span>Phương thức thanh toán</span>
            <div className="pay-methods">
                {options.map((m) => (
                    <label key={m} className={`pill ${value === m ? 'active' : ''}`}>
                        <RadioButton
                            inputId={m}
                            value={m}
                            onChange={(e) => onChange(e.value)}
                            checked={value === m}
                        />
                        <span className="pill-text">
              {m === PM.CASH && 'Tiền mặt'}
                            {m === PM.BANK_TRANSFER && 'Chuyển khoản'}
                            {m === PM.QR_CODE && 'QR Code'}
                            {m === PM.ONLINE && 'Thanh toán Online'}
            </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
