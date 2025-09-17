import { AppUrls } from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";

// Lấy danh sách program có phân trang
export async function getListProgram({ page = 1, size = 10 } = {}) {
    const url = AppUrls.listProgram;
    try {
        const token = localStorage.getItem("token")
        const res = await axiosClient.get(url, {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = res?.data ?? res;
        const result = data?.result ?? {};

        return {
            items: (result.items ?? []).map(mapProgram),
            paging: {
                page: result.page ?? page,
                size: result.size ?? size,
                totalItems: result.totalItems ?? 0,
                totalPages: result.totalPages ?? 0,
                hasNext: !!result.hasNext,
                hasPrevious: !!result.hasPrevious,
            },
        };
    } catch (error) {
        console.error("Lỗi khi gọi getListProgram:", error);
        throw error;
    }
}

function mapProgram(item) {
    return {
        id: item.id,
        title: item.title,
        fee: item.fee,
        code: (item.code || "").trim(),
        minStudent: item.minStudent,
        maxStudent: item.maxStudent,
        description: item.description,
        imageUrl: item.imageUrl,
        isActive: !!item.isActive,
    };
}
