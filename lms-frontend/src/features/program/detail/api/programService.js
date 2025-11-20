import axiosClient from "@/shared/api/axiosClient";
import { AppUrls } from "@/shared/constants";

export async function getProgramDetail(id) {
    if (!id) throw new Error("Missing program id");
    const url = AppUrls.getDetailProgram(id);
    try {
        const token = localStorage.getItem("token");
        const res = await axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = res?.data?.result ?? null;
        return mapProgramDetail(data);
    } catch (err) {
        console.error("Lỗi khi gọi getProgramDetail:", err);
        throw err;
    }
}
function mapProgramDetail(data) {
    if (!data) return null;
    return {
        id: data.id,
        title: data.titleProgram ?? data.title ?? "",
        code: (data.codeProgram ?? data.code ?? "").trim(),
        description: data.descriptionProgram ?? data.description ?? "",
        fee: Number(data.fee) || 0,
        minStudent: data.minStudents ?? data.minStudent ?? 0,
        maxStudent: data.maxStudents ?? data.maxStudent ?? 0,
        imageUrl: data.imgUrl ?? data.imageUrl ?? "/noimg.png",
        isActive: Boolean(data.isActive),

        tracks: (data.tracks ?? []).map(t => ({
            code: (t.trackCode ?? t.code ?? "").trim(),
            label: t.trackLabel ?? t.label ?? "",
        })),

        subjects: (data.subjectList ?? data.subjects ?? []).map(s => ({
            id: s.subjectId ?? s.id,
            title: s.subjectTitle ?? s.title ?? "",
            order: s.order ?? 0,
            courses: (s.courses ?? []).map(c => ({
                id: c.courseId ?? c.id,
                title: c.courseTitle ?? c.title ?? "",
                code: (c.courseCode ?? c.code ?? "").trim(),
                sessions: c.plannedSessions ?? c.sessions ?? 0,
                capacity: c.capacity ?? 0,
                startDate: c.startDate ?? null,
                schedule: c.schedule ?? "",
                status: c.status ?? 0,
                statusName: c.statusName ?? "",
                trackCode: (c.trackCode ?? "").trim(),
            })),
        })),
    };
}
