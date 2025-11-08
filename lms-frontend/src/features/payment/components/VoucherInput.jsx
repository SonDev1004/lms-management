import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';
import { currency } from '@/features/payment/utils/money';

export default function VoucherInput({
                                         voucher, setVoucher,
                                         voucherApplied, voucherLoading,
                                         discountAmount,             //GIẢM THỰC TẾ (đã tính theo basePrice)
                                         onApply,
                                         onClear,                    //optional: clear voucher
                                     }) {
    const canApply = !!String(voucher).trim() && !voucherLoading;

    const handleApply = () => onApply?.();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && canApply) handleApply();
    };

    return (
        <div className="p-field">
            <span>Mã voucher/Khuyến mãi</span>

            <div className="voucher-row">
                <InputText
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value.toUpperCase())} // ✅ chuẩn hoá input
                    onKeyDown={handleKeyDown}
                    className="ctrl"
                    placeholder="Nhập mã giảm giá"
                />
                <Button
                    type="button"
                    label="Áp dụng"
                    className="btn-apply"
                    onClick={handleApply}
                    loading={voucherLoading}
                    disabled={!canApply}
                />
                {voucherApplied && (
                    <Button
                        type="button"
                        label="Gỡ"
                        text
                        className="ml-2"
                        onClick={onClear}
                        disabled={voucherLoading}
                    />
                )}
            </div>

            <p className="voucher-hint">Thử: WELCOME10, STUDENT20, FAMILY15</p>

            {voucherApplied && (
                <div className="voucher-applied">
                    <Chip label={`Đã áp dụng: ${voucherApplied.code}`} className="mr-2" />
                    <Tag
                        //luôn hiển thị mức giảm THỰC TẾ
                        value={`- ${currency(discountAmount || 0)}`}
                        severity="success"
                    />
                </div>
            )}
        </div>
    );
}
