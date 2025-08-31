// src/utils/colorsCourseCard.js

// Danh sách màu pastel (tự chỉnh theo gu)
export const PASTEL_PALETTE = [
    '#FF9FB2',
    '#FFB7A5',
    '#FFCF99',
    '#FFD166',
    '#D9F99D',
    '#A7F3D0',
    '#5EEAD4',
    '#7DD3FC',
    '#93C5FD',
    '#A5B4FC',
    '#C4B5FD',
    '#FBCFE8'
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

// Hash FNV-1a 32-bit
export function hashStringToInt(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
}

// Chọn 1 màu pastel ổn định theo key (id/title)
export function pickPastelByKey(key) {
    const idx = hashStringToInt(String(key ?? 'x')) % PASTEL_PALETTE.length;
    return PASTEL_PALETTE[idx];
}

// Theme từ course (không dùng subject)
export function getCourseThemeStable(course) {
    const accent = pickPastelByKey(course?.id || course?.title);
    return buildThemeFromAccent(accent);
}
