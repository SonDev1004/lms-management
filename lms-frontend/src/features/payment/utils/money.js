export const currency = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(Math.max(0, Number(v || 0)));