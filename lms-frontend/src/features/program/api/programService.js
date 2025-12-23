import {AppUrls} from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";

// Lấy danh sách program có phân trang
export async function getListProgram({page = 1, size = 10} = {}) {
    const url = AppUrls.listProgram;
    try {
        const token = localStorage.getItem("token");
        const res = await axiosClient.get(url, {
            params: {page, size},
            headers: {Authorization: `Bearer ${token}`},
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

//Mapper chấp nhận cả tên key của BE ở list và ở detail
function mapProgram(item = {}) {
    const title =
        item.titleProgram ??
        item.title ??
        ""; // BE list có thể trả titleProgram

    const code =
        (item.codeProgram ?? item.code ?? "").trim();

    const description =
        item.descriptionProgram ?? item.description ?? "";

    const img =
        item.imgUrl ?? item.imageUrl ?? item.image ?? "/noimg.png";

    const fee =
        typeof item.fee === "string" ? Number(item.fee) || 0 : item.fee ?? 0;

    return {
        id: item.id,
        title,
        code,
        description,
        imageUrl: img,
        fee,
        minStudent: item.minStudents ?? item.minStudent ?? 0,
        maxStudent: item.maxStudents ?? item.maxStudent ?? 0,
        isActive: Boolean(item.isActive),
    };
}


//lấy chi tiết program
export async function getDetailProgram(programId) {
    const url = AppUrls.getDetailProgram(programId);
    try {
        const res = await axiosClient.get(url);
        const data = res?.data?.result ?? null;
        const program = mapProgramDetail(data);

        return program;
    } catch (error) {
        console.error("❌ Lỗi khi gọi getDetailProgram:", error);
        return null;
    }
}
// =========================
// V2 APIs for Programs & Subjects page (DO NOT break getListProgram)
// =========================

function unwrap(res) {
    const data = res?.data ?? res;
    return data?.result ?? data;
}

// =========================
// V2 APIs for Programs & Subjects page
// (DO NOT break existing getListProgram / getDetailProgram)
// =========================

/**
 * getProgramsPSPage
 * - Dùng cho ProgramList page mới (Programs & Subjects).
 * - ProgramFilterRequest BE: title, code, feeMin, feeMax, isActive, keyword
 * - Paging: mặc định pageBase=1 vì code cũ của bạn đang gọi page=1.
 */
export async function getProgramsPSPage({
                                            page0 = 0,
                                            size = 10,
                                            keyword,
                                            title,
                                            code,
                                            feeMin,
                                            feeMax,
                                            isActive,
                                            sort,
                                            pageBase = 1,
                                        } = {}) {
    const url = AppUrls.listProgram;
    const page = pageBase === 1 ? page0 + 1 : page0;

    const res = await axiosClient.get(url, {
        params: {
            page,
            size,
            ...(keyword ? { keyword } : null),
            ...(title ? { title } : null),
            ...(code ? { code } : null),
            ...(feeMin != null ? { feeMin } : null),
            ...(feeMax != null ? { feeMax } : null),
            ...(isActive != null ? { isActive } : null),
            ...(sort ? { sort } : null),
        },
    });

    const result = unwrap(res) ?? {};
    const itemsRaw = result.items ?? result.content ?? [];
    const totalItems = result.totalItems ?? result.totalElements ?? 0;

    const apiPage = result.page ?? result.number ?? page;
    const apiSize = result.size ?? result.pageSize ?? size;

    const page0FromApi = pageBase === 1 ? Math.max(0, (apiPage ?? 1) - 1) : (apiPage ?? 0);

    return {
        items: (itemsRaw ?? []).map(mapProgram),
        paging: {
            page: apiPage ?? page,
            page0: page0FromApi,
            size: apiSize,
            totalItems,
            totalPages: result.totalPages ?? 0,
            hasNext: !!result.hasNext,
            hasPrevious: !!result.hasPrevious,
            pageBase,
        },
    };
}

/**
 * Đếm tổng theo isActive mà không cần fetch full list:
 * - gọi /all-program?isActive=true size=1 -> totalItems
 */
export async function countProgramsByActivePS(isActive, pageBase = 1) {
    const { paging } = await getProgramsPSPage({ page0: 0, size: 1, isActive, pageBase });
    return paging?.totalItems ?? 0;
}

/**
 * Create program (ACADEMIC_MANAGER)
 * ProgramRequest: title, minStudent, maxStudent, fee, description, imageUrl, isActive
 */
export async function createProgramPS(payload) {
    const url = `${AppUrls.rootAPI}/program/create`;
    const res = await axiosClient.post(url, payload);
    return unwrap(res);
}

/**
 * Assign subjects to program (ACADEMIC_MANAGER)
 * CurriculumRequest: [{subjectId:1},{subjectId:2}]
 */
export async function assignSubjectsToProgramPS(programId, subjectIds = []) {
    const url = `${AppUrls.rootAPI}/program/${programId}/curriculum`;
    const body = (subjectIds ?? []).map((id) => ({ subjectId: id }));
    const res = await axiosClient.post(url, body);
    return unwrap(res);
}

/**
 * List subjects (for selecting in AddSubjectDialog)
 * Endpoint: /api/subject/all-subject (PageResponse<SubjectResponse>)
 */
export async function getSubjectsPSPage({ page0 = 0, size = 50, keyword, pageBase = 1 } = {}) {
    const url = AppUrls.listSubject;
    const page = pageBase === 1 ? page0 + 1 : page0;

    const res = await axiosClient.get(url, {
        params: {
            page,
            size,
            ...(keyword ? { keyword } : null),
        },
    });

    const result = unwrap(res) ?? {};
    const itemsRaw = result.items ?? result.content ?? [];
    const totalItems = result.totalItems ?? result.totalElements ?? 0;

    const apiPage = result.page ?? result.number ?? page;
    const apiSize = result.size ?? result.pageSize ?? size;
    const page0FromApi = pageBase === 1 ? Math.max(0, (apiPage ?? 1) - 1) : (apiPage ?? 0);

    return {
        items: (itemsRaw ?? []).map((s) => ({
            id: s.id,
            title: s.title ?? "",
            code: (s.code ?? "").trim(),
            sessionNumber: s.sessionNumber ?? 0,
            fee: s.fee ?? 0,
            isActive: !!s.isActive,
        })),
        paging: {
            page: apiPage ?? page,
            page0: page0FromApi,
            size: apiSize,
            totalItems,
            totalPages: result.totalPages ?? 0,
            hasNext: !!result.hasNext,
            hasPrevious: !!result.hasPrevious,
            pageBase,
        },
    };
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
