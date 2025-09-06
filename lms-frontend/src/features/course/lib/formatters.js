export function formatDateISO(isoString) {
    if (!isoString) return "-";
    const d = isoString instanceof Date ? isoString : new Date(isoString);
    try {
        return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
    } catch {
        return isoString;
    }
}