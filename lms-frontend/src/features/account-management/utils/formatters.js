export const initials = (name = "") =>
    name.split(" ").filter(Boolean).slice(0,2).map(s=>s[0]?.toUpperCase()).join("") || "NA";

export const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.round(diff / 60000);
    if (m < 60) return `${m} minutes ago`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} hours ago`;
    const d = Math.round(h / 24);
    if (d < 30) return `${d} days ago`;
    const mo = Math.round(d / 30);
    return `about ${mo} month${mo>1?"s":""} ago`;
};
