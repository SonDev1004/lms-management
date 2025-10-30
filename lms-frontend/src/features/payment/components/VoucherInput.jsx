import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';
import { currency } from '@/features/payment/utils/money';

export default function VoucherInput({
                                         voucher, setVoucher,
                                         voucherApplied, voucherLoading,
                                         onApply,
                                     }) {
    return (
        <div className="p-field">
            <span>Mã voucher/Khuyến mãi</span>
            <div className="voucher-row">
                <InputText
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    className="ctrl"
                    placeholder="Nhập mã giảm giá"
                />
                <Button
                    type="button"
                    label="Áp dụng"
                    className="btn-apply"
                    onClick={onApply}
                    loading={voucherLoading}
                    disabled={voucherLoading}
                />
            </div>
            <p className="voucher-hint">Thử: WELCOME10, STUDENT20, FAMILY15</p>

            {voucherApplied && (
                <div className="voucher-applied">
                    <Chip label={`Đã áp dụng: ${voucherApplied.code}`} className="mr-2" />
                    <Tag
                        value={
                            voucherApplied.type === 'PERCENT'
                                ? `-${voucherApplied.value}%`
                                : `-${currency(voucherApplied.value)}`
                        }
                        severity="success"
                    />
                </div>
            )}
        </div>
    );
}
