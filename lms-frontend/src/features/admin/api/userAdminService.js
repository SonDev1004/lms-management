// src/features/admin/api/userAdminService.js
import axiosClient from "@/shared/api/axiosClient";
import urls from "@/shared/constants/urls";

/** ApiResponse unwrap: { code, message, result } hoặc axiosClient trả thẳng data */
function unwrap(res) {
    const data = res?.data ?? res;
    return data?.result ?? data;
}

function normalizePage(pageLike) {
    if (Array.isArray(pageLike)) return { content: pageLike, totalElements: pageLike.length };
    const content = Array.isArray(pageLike?.content) ? pageLike.content : [];
    const totalElements =
        typeof pageLike?.totalElements === "number" ? pageLike.totalElements : content.length;
    return { ...pageLike, content, totalElements };
}

function normalizeCourseBrief(c) {
    return {
        courseId: c?.courseId ?? c?.id ?? null,
        code: c?.code ?? c?.courseCode ?? null,
        title: c?.title ?? c?.name ?? c?.courseTitle ?? c?.courseName ?? "",
        status: c?.status ?? null,
        startDate: c?.startDate ?? null,
        endDate: c?.endDate ?? null,
        raw: c,
    };
}

const userAdminService = {
    // ===================== Admin IT Users CRUD =====================
    async getUsers({ role, keyword, page = 0, size = 1000, sort } = {}) {
        const params = {
            ...(role ? { role: String(role).trim() } : null),
            ...(keyword ? { keyword: String(keyword).trim() } : null),
            page,
            size,
            ...(sort ? { sort } : null),
        };

        const res = await axiosClient.get(urls.adminItUsers, { params });
        const result = unwrap(res);
        return normalizePage(result).content;
    },

    async getUsersPage({ role, keyword, page = 0, size = 20, sort } = {}) {
        const params = {
            ...(role ? { role: String(role).trim() } : null),
            ...(keyword ? { keyword: String(keyword).trim() } : null),
            page,
            size,
            ...(sort ? { sort } : null),
        };

        const res = await axiosClient.get(urls.adminItUsers, { params });
        const result = unwrap(res);
        return normalizePage(result);
    },

    async getUserById(id) {
        if (id == null) throw new Error("getUserById: id is required");
        const res = await axiosClient.get(urls.adminItUserById(id));
        return unwrap(res);
    },

    async createUser(payload) {
        if (!payload?.userName?.trim()) throw new Error("createUser: userName is required");
        if (!payload?.email?.trim()) throw new Error("createUser: email is required");

        const res = await axiosClient.post(urls.createUser, {
            userName: payload.userName.trim(),
            email: payload.email.trim(),
            firstName: payload.firstName ?? null,
            lastName: payload.lastName ?? null,
            roleId: payload.roleId ?? null,
        });

        return unwrap(res);
    },

    async updateUser(id, payload) {
        if (id == null) throw new Error("updateUser: id is required");

        const res = await axiosClient.put(urls.adminItUserById(id), {
            userName: payload?.userName ?? null,
            email: payload?.email ?? null,
            firstName: payload?.firstName ?? null,
            lastName: payload?.lastName ?? null,
            isActive: payload?.isActive ?? null,
            roleId: payload?.roleId ?? null,
        });

        return unwrap(res);
    },

    async deleteUser(id) {
        if (id == null) throw new Error("deleteUser: id is required");
        const res = await axiosClient.delete(urls.adminItUserById(id));
        return unwrap(res);
    },

    async getRoles() {
        const res = await axiosClient.get(urls.getAllRoles);
        const result = unwrap(res);
        return Array.isArray(result) ? result : [];
    },

    // ===================== Staff Profile (Student) =====================
    async getStaffStudentProfile(userId) {
        const res = await axiosClient.get(urls.staffStudentProfile(userId));
        return unwrap(res);
    },

    async getStaffStudentCourses(userId) {
        const res = await axiosClient.get(urls.staffStudentCourses(userId));
        const list = unwrap(res);
        return (Array.isArray(list) ? list : []).map(normalizeCourseBrief);
    },

    async getStaffStudentAttendanceOverview(userId, courseId) {
        const res = await axiosClient.get(urls.staffStudentAttendanceOverview(userId, courseId));
        return unwrap(res);
    },

    async getStaffStudentAttendanceDetails(userId, courseId) {
        const res = await axiosClient.get(urls.staffStudentAttendanceDetails(userId, courseId));
        const list = unwrap(res);
        return Array.isArray(list) ? list : [];
    },

    // ===================== Staff Profile (Teacher) =====================
    async getStaffTeacherProfile(userId) {
        const res = await axiosClient.get(urls.staffTeacherProfile(userId));
        return unwrap(res);
    },

    async getStaffTeacherCourses(userId) {
        const res = await axiosClient.get(urls.staffTeacherCourses(userId));
        const list = unwrap(res);
        return (Array.isArray(list) ? list : []).map(normalizeCourseBrief);
    },
};

export default userAdminService;
