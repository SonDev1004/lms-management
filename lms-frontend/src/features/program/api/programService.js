import { AppUrls } from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";

// Lấy danh sách program có phân trang
export async function getListProgram({ page = 1, size = 10 } = {}) {
    const url = AppUrls.listProgram;
    try {
        const res = await axiosClient.get(url, { params: { page, size } });
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


//lấy chi tiết program
export async function getDetailProgram(programId) {
    const url = AppUrls.getDetailProgram(programId);
    try {
        const res = await axiosClient.get(url);
        const data = res?.data?.result ?? null;

        const program = mapProgramDetail(data);

        console.log("📌 Mapped program:", program);
        return program;
    } catch (error) {
        console.error("❌ Lỗi khi gọi getDetailProgram:", error);
        return null;
    }
}

function mapProgramDetail(data) {
    if (!data) return null;

    return {
        id: data.id,
        title: data.titleProgram ?? "",
        code: (data.codeProgram ?? "").trim(),
        description: data.descriptionProgram ?? "",
        fee: Number(data.fee) || 0,
        minStudents: data.minStudents ?? 0,
        maxStudents: data.maxStudents ?? 0,
        image: data.imgUrl || "/noimg.png",
        isActive: Boolean(data.isActive),

        tracks: (data.tracks ?? []).map((t) => ({
            code: (t.trackCode ?? "").trim(),
            label: t.trackLabel ?? "",
        })),

        subjects: (data.subjectList ?? []).map((s) => ({
            id: s.subjectId,
            title: s.subjectTitle ?? "",
            order: s.order ?? 0,
            courses: (s.courses ?? []).map((c) => ({
                id: c.courseId,
                title: c.courseTitle ?? "",
                code: (c.courseCode ?? "").trim(),
                sessions: c.plannedSessions ?? 0,
                capacity: c.capacity ?? 0,
                startDate: c.startDate ?? null,
                schedule: c.schedule ?? "",
                status: c.status ?? 0,
                statusName: c.statusName ?? "",
                trackCode: (c.trackCode ?? "").trim(),   // ✅ QUAN TRỌNG
            })),
        })),
    };
}
