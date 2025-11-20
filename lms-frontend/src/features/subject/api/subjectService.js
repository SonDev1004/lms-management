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

    const image = item.imgUrl ?? item.image ?? "/noimg.png";

    const fee = Number(item.fee) || 0;

    const tuitionMin =
        Number(item.tuitionMin ?? item.minFee ?? item.feeMin ?? fee) || 0;
    const tuitionMax =
        Number(item.tuitionMax ?? item.maxFee ?? item.feeMax ?? fee) || 0;

    return {
        id: item.id,
        title: item.title,
        code: item.code?.trim?.() ?? "",
        sessionNumber: Number(item.sessionNumber) || 0,
        fee,
        tuitionMin,
        tuitionMax,
        image,
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

    return {
        id: data.id,
        code: data.codeSubject ?? data.code ?? "",
        title: data.subjectTitle ?? data.title ?? "",
        description: data.subjectDescription ?? data.description ?? "",
        sessionNumber: Number(data.sessionNumber) || 0,
        fee: Number(data.fee) || 0,
        image: data.imgUrl || data.image || "/noimg.png",
        maxStudent: Number(data.maxStudents ?? data.maxStudent) || 0,
        minStudent: Number(data.minStudents ?? data.minStudent) || 0,
        isActive: Boolean(data.isActive),

        audience: data.audience ?? "Teens & Adults",
        level: data.level ?? "Intermediate (B1–B2)",
        summary: data.summary ?? "Boost your listening accuracy with exam-style drills.",
        rating: Number(data.rating ?? 4.7),
        reviewCount: Number(data.reviewCount ?? 0),

        syllabus: Array.isArray(data.syllabus) ? data.syllabus : [],

        classes: Array.isArray(data.classes)
            ? data.classes.map((cls) => ({
                courseId: cls.courseId,
                courseTitle: cls.courseTitle,
                courseCode: cls.courseCode,
                plannedSessions: Number(cls.plannedSessions) || 0,
                capacity: cls.capacity ?? 0,
                startDate: cls.startDate,
                schedule: cls.schedule,
                status: cls.status,
                statusName: cls.statusName,
                place: cls.place || cls.room,
            }))
            : [],
    };
}
