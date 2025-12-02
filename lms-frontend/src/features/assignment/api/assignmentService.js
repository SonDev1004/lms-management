// features/assignment/api/assignmentService.js
import axiosClient from "@/shared/api/axiosClient.js";
import {AppUrls} from "@/shared/constants/index.js";

/* ===================================================================
 *                        STUDENT SIDE
 * ===================================================================*/

/**
 * Lấy danh sách assignment của HỌC SINH trong 1 khóa học
 * Backend tự lấy student từ JWT nên FE chỉ cần gửi courseId.
 */
export const fetchStudentAssignments = async (courseId) => {

    if (!courseId) return [];

    const url = AppUrls.studentAssignmentsByCourse(courseId);
    const res = await axiosClient.get(url);
    const apiRes = res.data || {};

    const payload = apiRes.result ?? apiRes.data ?? [];
    const list = Array.isArray(payload)
        ? payload
        : payload.content ?? payload.items ?? [];

    return list.map(mapAssignmentDtoToUi).filter(Boolean);

    // return mapped.filter((item) => item.isActive !== false);


};

/* ===================================================================
 *                        TEACHER SIDE
 * ===================================================================*/

/**
 * Lấy danh sách assignment của 1 khóa học cho TEACHER
 */
export const fetchTeacherAssignmentsByCourse = async (courseId) => {
    if (!courseId) return [];

    const url = AppUrls.teacherAssignmentsByCourse(courseId);
    const res = await axiosClient.get(url);
    const apiRes = res.data || {};

    const payload = apiRes.result ?? apiRes.data ?? [];
    const list = Array.isArray(payload)
        ? payload
        : payload.content ?? payload.items ?? [];

    if (!Array.isArray(list)) return [];
    return list.map(mapAssignmentDtoToUi).filter(Boolean);
};
/**
 * Lấy danh sách học sinh + trạng thái 1 assignment cho teacher
 */
export const fetchAssignmentStudentsForTeacher = async (assignmentId) => {
    if (!assignmentId) return [];

    const url = AppUrls.teacherAssignmentStudents(assignmentId);
    const res = await axiosClient.get(url);
    const apiRes = res.data || {};
    const payload = apiRes.result ?? apiRes.data ?? [];
    const list = Array.isArray(payload)
        ? payload
        : payload.content ?? payload.items ?? [];

    return Array.isArray(list) ? list : [];
};

/**
 * Teacher nhắc tất cả HS chưa nộp bài
 */
export const remindNotSubmittedStudents = async (assignmentId) => {
    if (!assignmentId) throw new Error("assignmentId is required");
    const url = AppUrls.teacherRemindStudent(assignmentId);
    await axiosClient.post(url);
    return true;
};

export const publishTeacherAssignment = async (assignmentId) => {
    if (!assignmentId) throw new Error("assignmentId is required");

    const url = AppUrls.teacherPublishAssignment(assignmentId);
    const res = await axiosClient.post(url);
    const apiRes = res.data || {};
    const dto = apiRes.result ?? apiRes.data ?? null;
    return mapAssignmentDtoToUi(dto);
};

/**
 * Tạo assignment mới cho course
 * POST /teacher/courses/{courseId}/assignments
 */
export const createTeacherAssignment = async (courseId, formPayload) => {
    if (!courseId) throw new Error("courseId is required");

    const url = AppUrls.createTeacherAssignment(courseId);

    const isActiveValue =
        typeof formPayload.isActive === "boolean"
            ? formPayload.isActive
            : undefined;

    const body = {
        id: formPayload.id ?? null,
        courseId: formPayload.courseId ?? courseId,
        title: formPayload.title,
        maxScore: formPayload.maxScore,
        factor: formPayload.factor,
        fileName: formPayload.fileName ?? null,
        dueDate: formPayload.dueDate ?? null,
        assignmentType: formPayload.assignmentType ?? [],
        isActive: isActiveValue,
        active: isActiveValue,
        sessionId: formPayload.sessionId ?? null,
    };

    const res = await axiosClient.post(url, body);
    const apiRes = res.data || {};

    const dto = apiRes.result ?? apiRes.data;

    if (!dto) {
        console.error("API Response:", apiRes);
        throw new Error("Backend không trả về assignment data");
    }

    const mapped = mapAssignmentDtoToUi(dto);

    if (!mapped || !mapped.id) {
        console.error("Mapped result:", mapped, "Original DTO:", dto);
        throw new Error("Assignment được tạo nhưng không có ID");
    }

    return mapped;
};


/**
 * Update assignment cho teacher
 * PUT /teacher/assignments/{assignmentId}
 */
export const updateTeacherAssignment = async (assignmentId, formPayload) => {
    if (!assignmentId) throw new Error("assignmentId is required");

    const url = AppUrls.updateTeacherAssignment(assignmentId);

    const isActiveValue =
        typeof formPayload.isActive === "boolean"
            ? formPayload.isActive
            : undefined;

    const body = {
        id: formPayload.id ?? assignmentId,
        courseId: formPayload.courseId ?? null,
        title: formPayload.title,
        maxScore: formPayload.maxScore,
        factor: formPayload.factor,
        fileName: formPayload.fileName ?? null,
        dueDate: formPayload.dueDate ?? null,
        isActive: isActiveValue,
        active: isActiveValue,
        sessionId: formPayload.sessionId ?? null,
        assignmentType: formPayload.assignmentType ?? [],
    };

    const res = await axiosClient.put(url, body);
    const apiRes = res.data || {};
    const dto = apiRes.result ?? apiRes.data ?? null;
    return mapAssignmentDtoToUi(dto || body);
};


/**
 * Delete assignment
 */
export const deleteTeacherAssignment = async (assignmentId) => {
    if (!assignmentId) throw new Error("assignmentId is required");

    const url = AppUrls.deleteTeacherAssignment(assignmentId);
    await axiosClient.delete(url);
    return true;
};

/* ===================================================================
 *                        QUIZ CONFIG (TEACHER + AM)
 * ===================================================================*/

/**
 * Lấy cấu hình quiz cho 1 assignment
 * GET /teacher/assignments/{assignmentId}/quiz-config
 */
export const fetchAssignmentQuizConfig = async (assignmentId) => {
    if (!assignmentId) throw new Error("assignmentId is required");

    const url = AppUrls.assignmentQuizConfig(assignmentId);
    const res = await axiosClient.get(url);
    const apiRes = res.data || {};
    const dto = apiRes.result ?? apiRes.data ?? {};

    // dto = { assignmentId, assignmentTitle, items: [...] }
    return dto;
};

/**
 * Lưu cấu hình quiz
 * Body: [{ id?, questionId, points, orderNumber }]
 */
export const saveAssignmentQuizConfig = async (assignmentId, items) => {
    if (!assignmentId) throw new Error("assignmentId is required");

    const url = AppUrls.assignmentQuizConfig(assignmentId);

    const payload = (items || []).map((it, idx) => ({
        id: it.id ?? it.detailId ?? null,
        questionId: it.questionId,
        points: it.points ?? 1,
        orderNumber: it.orderNumber ?? idx + 1,
    }));

    const res = await axiosClient.post(url, payload);
    const apiRes = res.data || {};
    return apiRes.result ?? apiRes.data;
};

/* ===================================================================
 *                        COMMON MAPPING
 * ===================================================================*/

function mapAssignmentDtoToUi(dto) {
    if (!dto) return null;

    const rawDue =
        dto.dueDate ?? dto.due_date ?? dto.due ?? null;
    let typeVal = dto.assignmentType ?? dto.type ?? null;
    let typeArr;
    if (Array.isArray(typeVal)) {
        typeArr = typeVal;
    } else if (typeof typeVal === "string" && typeVal.length > 0) {
        typeArr = [typeVal];
    } else {
        typeArr = [];
    }

    let activeRaw = dto.isActive ?? dto.active;
    let isActive = true;
    if (typeof activeRaw === "boolean") {
        isActive = activeRaw;
    } else if (activeRaw != null) {
        isActive = String(activeRaw).toLowerCase() === "true";
    }

    const rawStatus =
        dto.status ?? dto.studentStatus ?? dto.submissionStatus ?? null;

    return {
        id:
            dto.id ??
            dto.assignmentId ??
            dto.assignment_id ??
            (dto.assignment ? dto.assignment.id : null),

        title: dto.title ?? dto.assignmentTitle ?? "",

        due: rawDue,

        dueDate: rawDue,

        studentStatus: mapStatus(rawStatus),
        grade: dto.studentScore ?? dto.score ?? null,

        maxScore: dto.maxScore ?? dto.max_score ?? null,
        sessionId: dto.sessionId ?? dto.session_id ?? null,
        courseId: dto.courseId ?? dto.course_id ?? null,

        assignmentType: typeArr,
        isActive,
    };
}


function mapStatus(status) {
    if (!status) return "not_submitted";
    const s = String(status).toUpperCase();
    if (s === "GRADED") return "graded";
    if (s === "SUBMITTED") return "submitted";
    if (s === "MISSING") return "missing";
    return "not_submitted";
}
