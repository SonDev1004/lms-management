const FALLBACK_IMG = "/noimg.png";

/**
 * Resolve program image URL from DB / BE / public assets
 * Supports:
 * - http(s)
 * - // protocol-relative
 * - data:image
 * - /img/... (Vite public)
 * - /uploads/... (BE static)
 * - uploads/... (prepend baseUrl)
 */
export function resolveProgramImage(program) {
    const raw =
        program?.imageUrl ??
        program?.imgUrl ??
        program?.image ??
        program?.thumbnail ??
        "";

    let v = String(raw ?? "").replace(/\r?\n/g, "").trim();
    if (!v) return ""; // ✅

    if (v.startsWith("//")) v = `https:${v}`;
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    if (v.startsWith("data:image/")) return v;

    if (v.startsWith("/img/")) return v;
    if (v.startsWith("img/")) return `/${v}`;

    if (v.startsWith("uploads/")) v = `/${v}`;

    const baseUrl = (import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_BASE_URL || "")
        .replace(/\/+$/, "");

    if (v.startsWith("/")) return baseUrl ? `${baseUrl}${v}` : v;

    return baseUrl ? `${baseUrl}/${v}` : v;
}
