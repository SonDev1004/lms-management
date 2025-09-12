// subjectService.js
import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";

export async function getListSubject({ page = 1, size = 10 } = {}) {
    const url = AppUrls.listSubject;
    try{
        const res = await axiosClient.get(url, { params: { page, size } });
        const data = res?.data ?? res;
        const result = data?.result ?? {};
        return{
            items: (result.items ?? []).map(mapSubject),
            paging: {
                page: result.page ?? page,
                size: result.size ?? size,
                totalItems: result.totalItems ?? 0,
                totalPages: result.totalPages ?? 0,
                hasNext: !!result.hasNext,
                hasPrevious: !!result.hasPrevious,
        }
        }
    }catch (error) {
        console.error("Lỗi khi gọi getListSubject:", error);
        throw error;
    }
}

function mapSubject(item) {
    return {
        id: item.id,
        title: item.title,
        code: item.code?.trim?.() ?? "",
        sessionNumber: Number(item.sessionNumber) || 0,
        fee: Number(item.fee),
        image: item.image || "/noimg.png",
        minStudent: Number(item.minStudent) || 0,
        maxStudent: Number(item.maxStudent) || 0,
        description: item.description ?? "",
        isActive: Boolean(item.isActive),
    };
}
