// src/features/program/components/ProgramHero.jsx
import React, { useMemo, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

const FALLBACK_IMG = "/noimg.png";

const formatPrice = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

function resolveImageUrl(raw, programCode) {
    let v = String(raw ?? "").replace(/\r?\n/g, "").trim();

    // ✅ Nếu không có raw image, thử dùng program code
    if (!v && programCode) {
        // Thử các pattern phổ biến: p-1, p-2, SAT-PREP, etc.
        const code = programCode.toLowerCase().replace(/\s+/g, "-");
        return `/img/programs/${code}.jpg`;
    }

    if (!v) return "";

    // protocol-relative
    if (v.startsWith("//")) v = `https:${v}`;

    // absolute URL
    if (v.startsWith("http://") || v.startsWith("https://")) return v;

    // data URL
    if (v.startsWith("data:image/")) return v;

    // ✅ Đã là path đầy đủ trong /img/programs/
    if (v.startsWith("/img/programs/")) return v;
    if (v.startsWith("img/programs/")) return `/${v}`;

    // ✅ Nếu là tên file đơn giản (không có path), tìm trong /img/programs/
    if (!v.includes("/")) {
        // Nếu không có extension, thêm .jpg
        if (!v.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            v = `${v}.jpg`;
        }
        return `/img/programs/${v}`;
    }

    // ✅ FE public: MUST keep as-is
    if (v.startsWith("/img/")) return v;
    if (v.startsWith("img/")) return `/${v}`;

    // Normalize uploads path (BE static)
    if (v.startsWith("uploads/")) v = `/${v}`;

    const baseUrl =
        (import.meta.env.VITE_ASSET_BASE_URL ||
            import.meta.env.VITE_API_BASE_URL ||
            "").replace(/\/+$/, ""); // remove trailing /

    // ✅ If path starts with "/" but is NOT "/img/...", it's likely BE path
    if (v.startsWith("/")) return baseUrl ? `${baseUrl}${v}` : v;

    // plain path (no slash)
    return baseUrl ? `${baseUrl}/${v}` : v;
}

function pickProgramImage(program) {
    if (!program) return "";

    // ✅ Prefer these first (most common in your mappers)
    const direct =
        program.imageUrl ||
        program.imgUrl ||
        program.image ||
        program.thumbnail ||
        program.bannerUrl;

    // image can be object
    if (direct && typeof direct === "object") {
        return direct.url || direct.thumbnail || direct.src || "";
    }

    // image can be string
    return typeof direct === "string" ? direct : "";
}

export default function ProgramHero({ program, onConsult }) {
    const [imgError, setImgError] = useState(false);
    if (!program) return null;

    const rawImage = pickProgramImage(program);

    const imgSrc = useMemo(() => {
        const resolved = resolveImageUrl(rawImage, program.code);
        return resolved || FALLBACK_IMG;
    }, [rawImage, program.code]);

    const finalSrc = imgError ? FALLBACK_IMG : imgSrc;

    // ✅ Debug (remove after fixed)
    console.log("[ProgramHero IMG]", {
        programCode: program.code,
        rawImage,
        imgSrc,
        finalSrc
    });

    return (
        <Card className="shadow-3 border-round-2xl program-hero-card">
            <div className="grid align-items-center md:align-items-start gap-3">
                <div className="col-12 md:col-5">
                    <div className="program-hero-imgwrap">
                        <img
                            src={finalSrc}
                            alt={program.title || "Program"}
                            className="program-hero-img"
                            loading="eager"
                            onError={(e) => {
                                if (e.currentTarget.src.endsWith(FALLBACK_IMG)) return;
                                console.warn("[ProgramHero] Image failed:", e.currentTarget.src);
                                setImgError(true);
                            }}
                        />
                    </div>
                </div>

                <div className="col-12 md:col-7">
                    <h1 className="text-3xl md:text-4xl font-bold text-900 mb-2">
                        {program.title}
                    </h1>

                    {program.description && (
                        <p className="text-700 line-height-3 mb-3">{program.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                        {program.code && (
                            <Tag value={`Code: ${program.code}`} severity="info" rounded />
                        )}
                        {(program.minStudents || program.maxStudents) && (
                            <Tag
                                value={`Class size: ${program.minStudents ?? "?"}-${program.maxStudents ?? "?"}`}
                                severity="warning"
                                rounded
                            />
                        )}
                        <Tag value={formatPrice(program.fee)} severity="success" rounded />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            label="Get Free Consultation"
                            icon="pi pi-phone"
                            className="w-full md:w-auto p-button-lg p-button-outlined"
                            onClick={onConsult}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}