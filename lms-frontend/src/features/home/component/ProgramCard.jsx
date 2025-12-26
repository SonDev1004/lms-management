import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import "../styles/ProgramCard.css";
const FALLBACK_IMG = "/noimg.png";

/**
 * Normalize/resolve image URL:
 * - trims CR/LF
 * - supports absolute http(s)
 * - supports protocol-relative //
 * - supports data:image
 * - supports relative path /img/... (public) or /uploads/... (BE static)
 * - supports plain path img/... or uploads/... (prepend baseUrl if provided)
 */
function resolveImageUrl(raw, baseUrl) {
    let v = String(raw ?? "").replace(/\r?\n/g, "").trim();
    if (!v) return "";

    // protocol-relative
    if (v.startsWith("//")) v = `https:${v}`;

    // absolute URL
    if (v.startsWith("http://") || v.startsWith("https://")) return v;

    // data URL
    if (v.startsWith("data:image/")) return v;

    // relative (leading slash)
    if (v.startsWith("/")) {
        // /img/... should be served by FE (Vite public). Keep as-is.
        if (v.startsWith("/img/")) return v;

        // other paths: if BE hosts static (e.g. /uploads/...), prepend baseUrl when provided
        return baseUrl ? `${baseUrl}${v}` : v;
    }

    // plain path (no leading slash)
    // if it's already under img/, make it absolute from root
    if (v.startsWith("img/")) return `/${v}`;

    // otherwise treat as BE path (uploads/...) if baseUrl exists
    return baseUrl ? `${baseUrl}/${v}` : v;
}

export default function ProgramCard({ program }) {
    const nav = useNavigate();
    const p = program || {};

    const feeValue = p.fee ?? p.price ?? null;

    // Prefer BE field (imageUrl) then other possible aliases
    const rawImage = p.imageUrl || p.image || p.thumbnail || p.bannerUrl || "";

    // Use when BE serves /uploads/... on another domain (optional)
    const assetBaseUrl =
        import.meta.env.VITE_ASSET_BASE_URL || import.meta.env.VITE_API_BASE_URL || "";

    const imgSrc = useMemo(() => {
        return resolveImageUrl(rawImage, assetBaseUrl) || FALLBACK_IMG;
    }, [rawImage, assetBaseUrl]);

    const header = (
        <div className="program-card__img-wrapper">
            <img
                src={imgSrc}
                alt={p.title || "Program image"}
                className="program-card__img"
                loading="lazy"
                onError={(e) => {
                    // avoid infinite loop
                    if (e.currentTarget.src.endsWith(FALLBACK_IMG)) return;
                    e.currentTarget.src = FALLBACK_IMG;
                }}
            />
        </div>
    );

    return (
        <Card className="program-card" header={header}>
            <div className="program-card__head">
                <h3 className="program-card__title">{p.title || "Untitled program"}</h3>
                <Tag
                    value={p.isActive ? "Active" : "Inactive"}
                    severity={p.isActive ? "success" : "danger"}
                    className="program-card__status"
                />
            </div>

            <p className="program-card__desc">
                {(p.description || "").trim() || "No description available."}
            </p>

            <div className="program-card__bottom">
                <div className="program-card__tuition">
                    <div className="label">Tuition</div>
                    <div className="price">{formatVND(feeValue)}</div>
                </div>

                <Button
                    label="View Details"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    text
                    className="program-card__cta"
                    onClick={() => nav(`/programs/${p.id}`)}
                />
            </div>
        </Card>
    );
}

function formatVND(value) {
    if (value === null || value === undefined || value === "") return "Contact us";
    const n = Number(value);
    if (!Number.isFinite(n)) return "Contact us";
    return n.toLocaleString("vi-VN") + " VND";
}