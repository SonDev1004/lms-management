import urls from "@/shared/constants/urls.js";
import axiosClient from "@/shared/api/axiosClient.js";

export async function fetchLatestEnrollments(params = {}) {
    const search = new URLSearchParams();

    // Paging
    if (params.page != null) search.set("page", String(params.page));
    if (params.size != null) search.set("size", String(params.size));

    // Optional filters
    if (params.status) search.set("status", params.status);
    if (params.programId) search.set("programId", String(params.programId));
    if (params.courseId) search.set("courseId", String(params.courseId));
    if (params.fromDate) search.set("fromDate", params.fromDate);
    if (params.toDate) search.set("toDate", params.toDate);

    const qs = search.toString();
    const url = qs
        ? `${urls.adminLatestEnrollments}?${qs}`
        : urls.adminLatestEnrollments;

    try {
        const axiosRes = await axiosClient.get(url, {
            withCredentials: true,
            headers: { Accept: "application/json" },
        });

        const result = axiosRes?.data?.result ?? axiosRes?.data;

        // If BE returns a PageResponse
        if (result && Array.isArray(result.content)) {
            return {
                content: result.content,
                totalElements: result.totalElements,
                totalPages: result.totalPages,
                page: result.page,
                size: result.size,
            };
        }

        // If BE returns a List<LatestEnrollmentItemResponse>
        if (Array.isArray(result)) {
            return {
                content: result,
                totalElements: result.length,
                totalPages: 1,
                page: 0,
                size: result.length,
            };
        }

        // Default fallback
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            page: 0,
            size: 0,
        };
    } catch (err) {
        const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Không tải được danh sách enrollment";
        throw new Error(msg);
    }
}
