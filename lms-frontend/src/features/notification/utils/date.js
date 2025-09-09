export const formatDateShort = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm} – ${hh}:${min}`;
};

export const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString();
};

export const isToday = (iso) => {
    const d = new Date(iso);
    const t = new Date();
    return d.toDateString() === t.toDateString();
};

export const isThisWeek = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= 7 && !isToday(iso);
};
