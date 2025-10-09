export const currency = (n = 0) =>
    (n ?? 0).toLocaleString("vi-VN") + "đ";

export const classSize = (min, max) =>
    min && max ? `${min}–${max} students/class` : "Small class";

export const sessionsText = (n) => (n ? `${n} sessions` : "");
export const shortDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
};
