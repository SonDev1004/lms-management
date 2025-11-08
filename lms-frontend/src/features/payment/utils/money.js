/** Dùng cho tính toán — convert string "7.390.000đ" → 7390000 */
export const parseCurrency = (v) => {
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    const digits = String(v).replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
};

/** Hiển thị số tiền mà không kèm ký hiệu ₫ (ví dụ "7.390.000") */
export const formatAmount = (v) =>
    new Intl.NumberFormat('vi-VN').format(Math.max(0, Number(v || 0)));

/** Hiển thị có ký hiệu ₫ (ví dụ "7.390.000 ₫") */
export const currency = (v) =>
    new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'})
        .format(Math.max(0, Number(v || 0)));
