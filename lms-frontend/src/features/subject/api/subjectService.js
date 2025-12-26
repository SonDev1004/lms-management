import axiosClient from "@/shared/api/axiosClient.js";
import {AppUrls} from "@/shared/constants/index.js";


export async function getListSubject({page = 1, size = 10} = {}) {
    const url = AppUrls.listSubject;
    try {
        const res = await axiosClient.get(url, {params: {page, size}});
        const data = res?.data ?? res;
        const result = data?.result ?? {};
        return {
            items: (result.items ?? []).map(mapSubject),
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
        console.error("Lỗi khi gọi getListSubject:", error);
        throw error;
    }
}

function mapSubject(item = {}) {
    const image =
        item.imageUrl ??
        item.imgUrl ??
        item.image ??
        "";

    const fee = Number(item.fee) || 0;

    return {
        id: item.id,
        title: item.title,
        code: item.code?.trim?.() ?? "",
        sessionNumber: Number(item.sessionNumber) || 0,
        fee,
        image,          // RAW image
        imageUrl: image, // alias cho đồng bộ
        minStudent: Number(item.minStudent) || 0,
        maxStudent: Number(item.maxStudent) || 0,
        description: item.description ?? "",
        audience: item.audience ?? "",
        isActive: Boolean(item.isActive),
    };
}


export async function getSubjectDetail(subjectId) {
    const url = AppUrls.getDetailSubject(subjectId);
    try {
        const res = await axiosClient.get(url);
        const data = res?.data?.result ?? null;
        return mapSubjectDetail(data);
    } catch (error) {
        console.error("❌ Lỗi khi gọi getSubjectDetail:", error);
        return null;
    }
}

export function mapSubjectDetail(data) {
    if (!data) return null;

    const coursesRaw = Array.isArray(data.courses) ? data.courses : (Array.isArray(data.classes) ? data.classes : []);

    const image = data.imageUrl ?? data.imgUrl ?? data.image ?? "/noimg.png";

    return {
        id: data.id,
        code: data.code ?? data.codeSubject ?? "",
        title: data.title ?? data.subjectTitle ?? "",
        description: data.description ?? data.subjectDescription ?? "",
        sessionNumber: Number(data.sessionNumber) || 0,
        fee: Number(data.fee) || 0,
        image,
        imageUrl: image,
        maxStudent: Number(data.maxStudent ?? data.maxStudents) || 0,
        minStudent: Number(data.minStudent ?? data.minStudents) || 0,
        isActive: Boolean(data.isActive),


        audience: data.audience ?? "Teens & Adults",
        level: data.level ?? "Intermediate (B1–B2)",
        summary: data.summary ?? "",
        rating: Number(data.rating ?? 0),
        reviewCount: Number(data.reviewCount ?? 0),

        classes: coursesRaw.map((cls) => ({
            courseId: cls.courseId,
            courseTitle: cls.courseTitle,
            courseCode: cls.courseCode,
            plannedSessions: Number(cls.plannedSessions) || 0,
            capacity: cls.capacity ?? 0,
            startDate: cls.startDate,
            schedule: cls.schedule,
            status: cls.status,
            statusName: cls.statusName,
        })),
    };
}


/**
 * =========================
 * NEW APIs FOR STAFF (SAFE ADD)
 * =========================
 */

function unwrap(res) {
    return res?.data?.result ?? res?.data ?? res;
}

/**
 * Mapper: SubjectResponse (STAFF)
 */
export function mapSubjectP(s = {}) {
    return {
        id: s.id,
        title: s.title ?? "",
        code: (s.code ?? "").trim(),
        sessionNumber: s.sessionNumber ?? 0,
        fee: typeof s.fee === "string" ? Number(s.fee) || 0 : (s.fee ?? 0),
        minStudent: s.minStudent ?? 0,
        maxStudent: s.maxStudent ?? 0,
        isActive: !!s.isActive,
    };
}

/**
 * GET /api/subject/all-subject
 * Paging + filter – dùng cho Staff Subjects tab
 */
export async function getSubjectsPage({
                                          page0 = 0,
                                          size = 10,
                                          pageBase = 1,
                                          keyword,
                                          title,
                                          code,
                                          isActive,
                                          feeMin,
                                          feeMax,
                                          sort,
                                      } = {}) {
    const page = pageBase === 1 ? page0 + 1 : page0;

    const res = await axiosClient.get(AppUrls.listSubject, {
        params: {
            page,
            size,
            ...(keyword ? {keyword} : null),
            ...(title ? {title} : null),
            ...(code ? {code} : null),
            ...(isActive != null ? {isActive} : null),
            ...(feeMin != null ? {feeMin} : null),
            ...(feeMax != null ? {feeMax} : null),
            ...(sort ? {sort} : null),
        },
    });

    const result = unwrap(res) ?? {};
    const itemsRaw = result.items ?? result.content ?? [];

    const apiPage = result.page ?? result.number ?? page;
    const apiSize = result.size ?? result.pageSize ?? size;
    const page0FromApi =
        pageBase === 1 ? Math.max(0, (apiPage ?? 1) - 1) : (apiPage ?? 0);

    return {
        items: itemsRaw.map(mapSubjectP),
        paging: {
            page: apiPage,
            page0: page0FromApi,
            size: apiSize,
            totalItems: result.totalItems ?? result.totalElements ?? 0,
            totalPages: result.totalPages ?? 0,
            hasNext: !!result.hasNext,
            hasPrevious: !!result.hasPrevious,
            pageBase,
        },
    };
}

/**
 * Mapper: SubjectDetailResponse (STAFF)
 * KHỚP 100% DTO BE
 */
export function mapSubjectDetailP(data) {
    if (!data) return null;

    return {
        id: data.id,
        code: (data.codeSubject ?? "").trim(),
        title: data.subjectTitle ?? "",
        description: data.subjectDescription ?? "",
        sessionNumber: data.sessionNumber ?? 0,
        fee: Number(data.fee) || 0,
        image: data.imgUrl ?? "/noimg.png",
        minStudents: data.minStudents ?? 0,
        maxStudents: data.maxStudents ?? 0,
        isActive: !!data.isActive,

        classes: Array.isArray(data.classes)
            ? data.classes.map((c) => ({
                id: c.courseId,
                title: c.courseTitle ?? "",
                code: (c.courseCode ?? "").trim(),
                plannedSessions: c.plannedSessions ?? 0,
                capacity: c.capacity ?? 0,
                startDate: c.startDate ?? null,
                schedule: c.schedule ?? "",
                statusName: c.statusName ?? "",
            }))
            : [],
    };
}

/**
 * GET subject detail (STAFF)
 */
export async function getSubjectDetailP(id, {onlyUpcoming = true} = {}) {
    const res = await axiosClient.get(AppUrls.getDetailSubject(id), {
        params: {onlyUpcoming},
    });
    return mapSubjectDetailP(unwrap(res));
}

/**
 * CREATE subject
 */
export async function createSubject(payload) {
    const res = await axiosClient.post(AppUrls.createSubject, payload);
    return unwrap(res);
}
