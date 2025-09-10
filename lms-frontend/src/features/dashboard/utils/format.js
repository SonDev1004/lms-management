export function currency(n) {
    if (n == null) return '-';
    return n.toLocaleString('vi-VN') + ' ₫';
}

export function shortNumber(n) {
    if (n == null) return '-';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
}