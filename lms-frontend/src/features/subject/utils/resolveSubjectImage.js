const FALLBACK_IMG = "/noimg.png";

/**
 * Resolve image url for Subject (works for list + detail)
 * Supports:
 * - absolute http(s)
 * - protocol-relative //
 * - data:image
 * - /img/... from FE public
 * - /uploads/... from BE static
 * - uploads/... (prepend baseUrl)
 * - plain filename -> /img/subjects/<filename> (optional)
 */
export function resolveSubjectImageUrl(raw, { baseUrl = "" } = {}) {
    let v = String(raw ?? "").replace(/\r?\n/g, "").trim();
    if (!v) return "";

    if (v.startsWith("//")) v = `https:${v}`;
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    if (v.startsWith("data:image/")) return v;

    // FE public
    if (v.startsWith("/img/")) return v;
    if (v.startsWith("img/")) return `/${v}`;

    // normalize uploads
    if (v.startsWith("uploads/")) v = `/${v}`;

    // BE static
    if (v.startsWith("/")) return baseUrl ? `${baseUrl}${v}` : v;

    // plain filename fallback to /img/subjects/
    if (!v.includes("/")) return `/img/subjects/${v}`;

    return baseUrl ? `${baseUrl}/${v}` : v;
}

export function subjectFallbackImageById(id, count = 20) {
    const n = Number(id) || 1;
    const idx = (n % count) + 1;
    // bạn có cả jpg và webp, ưu tiên webp
    return `/img/subjects/s-${idx}.webp`;
}

export function getSubjectCover(subject) {
    const raw =
        subject?.imageUrl ??
        subject?.imgUrl ??
        subject?.image ??
        subject?.thumbnail ??
        "";

    const baseUrl = (import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_BASE_URL || "")
        .replace(/\/+$/, "");

    const resolved = resolveSubjectImageUrl(raw, { baseUrl });
    return resolved || subjectFallbackImageById(subject?.id) || FALLBACK_IMG;
}
