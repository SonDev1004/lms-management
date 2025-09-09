// features/lesson/api/lessonService.js
import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";

/** Lấy mảng items từ nhiều kiểu payload khác nhau */
function pickItems(res) {
    const d = res?.data;
    if (Array.isArray(d?.result)) return d.result;
    if (Array.isArray(d?.result?.items)) return d.result.items;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d)) return d;
    return [];
}

/** Nhận diện loại tài liệu (hỗ trợ URL có query/hash) */
function detectDocType(url = "") {
    const u = String(url).toLowerCase();
    if (!u) return "other";
    if (/\.(pdf)(\?|#|$)/i.test(u)) return "pdf";
    if (/\.(png|jpe?g|gif|webp)(\?|#|$)/i.test(u)) return "image";
    if (/\.(mp3|wav|m4a|ogg)(\?|#|$)/i.test(u)) return "audio";
    return "other";
}

function fileNameFromUrl(url = "") {
    try {
        return decodeURIComponent(String(url).split("/").pop() || "") || "Tài liệu";
    } catch {
        return "Tài liệu";
    }
}

/** Chuẩn hóa mảng documents từ nhiều định dạng backend có thể trả */
function toDocuments(row = {}) {
    // Backend hiện tại: row.document là string; tương lai có thể là documents: []
    const rawList = Array.isArray(row.documents)
        ? row.documents
        : (row.document ? [row.document] : []);

    return rawList
        .filter(Boolean)
        .map((doc, i) => {
            const url = typeof doc === "string" ? doc : (doc.url || doc.link || "");
            const name = typeof doc === "string"
                ? fileNameFromUrl(doc)
                : (doc.name || doc.fileName || fileNameFromUrl(url));
            return {
                id: `${row.id}-doc-${i}`,
                name,
                type: detectDocType(url),
                url,
                download: true,
            };
        });
}

/** Map 1 lesson về model UI mà component đang dùng */
function mapLesson(row = {}) {
    return {
        id: String(row.id),
        title: row.title || "—",
        desc: row.description || "",
        content: row.content || "",
        teacher: "", // payload chưa có
        subject: row.subjectTitle || "",
        publishedAt: null,
        updatedAt: null,
        materials: [],
        objectives: [],
        activities: [],
        documents: toDocuments(row),
        _raw: row,
    };
}

/**
 * Lấy lessons theo subject
 * @param {number|string} subjectId
 * @param {{page?: number, size?: number}} params - 0-based paging (mặc định page=0)
 */
async function getBySubject(subjectId, params = {}) {
    if (subjectId == null || subjectId === "") {
        throw new Error("Missing subjectId");
    }
    const p = Number(params.page ?? 0) || 0;   // 0-based
    const s = Number(params.size ?? 5)  || 5;

    const url = AppUrls.lessonBySubject(subjectId);


    const res = await axiosClient.get(url, { params: { page: p, size: s, ...params } });
    const items = pickItems(res);
    return (items || []).map(mapLesson);
}

export default { getBySubject };
