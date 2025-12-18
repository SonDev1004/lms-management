
import urls from "@/shared/constants/urls.js";
import axiosClient from "@/shared/api/axiosClient.js";

/**
 * Build query params từ filter, đảm bảo không gửi 0 lên BE
 */
function buildFilterParams({ year, month, status, programId, subjectId }) {
    const params = { year, month };

    // status: SUCCESS | FAILED | ALL | undefined
    if (status && status !== "ALL") {
        params.status = status;
    }

    if (programId != null && programId !== 0) {
        params.programId = programId;
    }
    if (subjectId != null && subjectId !== 0) {
        params.subjectId = subjectId;
    }

    return params;
}

/**
 * Gọi API lấy danh sách giao dịch trong 1 tháng
 */
export async function fetchMonthlyTransactions(filter) {
    try {
        const params = buildFilterParams(filter);

        const res = await axiosClient.get(urls.tuitionRevenueTransactions, {
            params,
        });

        const data = res.data;
        const rows = data?.result;

        if (Array.isArray(rows)) {
            return rows;
        }

        console.warn("[tuitionRevenueApi] Unexpected transactions shape:", data);
        return [];
    } catch (err) {
        console.error("[tuitionRevenueApi] fetchMonthlyTransactions error:", err);
        throw err;
    }
}

/**
 * Gọi API summary doanh thu theo tháng
 */
export async function fetchRevenueSummary(filter) {
    try {
        const params = buildFilterParams(filter);

        const res = await axiosClient.get(urls.tuitionRevenueSummary, {
            params,
        });

        const data = res.data;
        return data?.result || null;
    } catch (err) {
        console.error("[tuitionRevenueApi] fetchRevenueSummary error:", err);
        throw err;
    }
}
