// src/utils/colorsCourseCard.js

// Danh sách màu pastel (tự chỉnh theo gu)
export const PASTEL_PALETTE = [
    '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9',
    '#BBDEFB', '#B3E5FC', '#B2EBF2', '#C8E6C9', '#DCEDC8',
    '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC', '#D7CCC8',
    '#F5F5F5', '#CFD8DC',
];

// Màu chữ tương phản (đen/trắng) theo nền
export function getContrastColor(cssColor) {
    if (!cssColor) return '#222';
    const c = cssColor.trim();

    if (c.startsWith('#')) {
        const hex = c.slice(1);
        const hexFull = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex;
        const bigint = parseInt(hexFull, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 160 ? '#222' : '#FAFAFA';
    }

    if (c.startsWith('hsl')) {
        const inside = c.substring(c.indexOf('(') + 1, c.lastIndexOf(')'));
        const parts = inside.split(/[, ]+/).filter(Boolean);
        if (parts.length >= 3) {
            const m = parts[2].match(/(\d+(\.\d+)?)/);
            if (m) return Number(m[1]) >= 64 ? '#222' : '#FAFAFA';
        }
    }
    return '#222';
}

// Tạo theme đầy đủ từ một màu accent
export function buildThemeFromAccent(accent) {
    const accentText = getContrastColor(accent);
    const metaTextColor = accentText === '#FAFAFA' ? 'rgba(255,255,255,0.86)' : 'rgba(34,34,34,0.78)';
    const metaBg = accentText === '#FAFAFA' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
    return { accent, accentText, metaTextColor, metaBg };
}

// Fisher–Yates shuffle để xáo trộn bảng màu (random 1 lần khi mở trang)
export function shuffle(arr, rnd = Math.random) {
    const a = arr.slice(); // giữ nguyên input
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
