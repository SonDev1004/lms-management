import axiosClient from "@/shared/api/axiosClient";
import AppUrls from "@/shared/constants/urls";

/** Chuẩn hoá object notification trả về (nếu bạn đang dùng trong list) */
const normalize = (m = {}) => ({
    id: m.id,
    title: m.title,
    content: m.content ?? "",
    isSeen: !!m.isSeen,
    type: m.type ?? m.notificationType ?? null,
    postedDate: m.postedDate ?? m.createdAt ?? null,
    sender: m.sender ?? null,
    url: m.url || "",
    course: m.course || "",
});

/* ========= USER APIs ========= */
export const getMyNotifications = async () => {
    const { data } = await axiosClient.get(AppUrls.getMyNotifications);
    return (data?.result || []).map(normalize);
};

export const getUnseenNotifications = async () => {
    const { data } = await axiosClient.get(AppUrls.getUnseenNotifications);
    return (data?.result || []).map(normalize);
};

export const markAsSeen = async (id) => {
    const { data } = await axiosClient.post(AppUrls.markAsSeen(id));
    return data?.result ?? true;
};

/* ========= ADMINIT: SEND ========= */
export const sendNotification = async (payload) => {
    const safe = { ...payload };

    if (safe.severity != null) safe.severity = Number(safe.severity);
    if (safe.notificationTypeId != null) safe.notificationTypeId = Number(safe.notificationTypeId);

    ["url"].forEach((k) => {
        if (!safe[k]) delete safe[k];
    });
    ["targetRoles", "targetUserIds", "targetCourseIds", "targetProgramIds"].forEach((k) => {
        if (!Array.isArray(safe[k]) || safe[k].length === 0) delete safe[k];
    });
    if (!safe.scheduledDate) delete safe.scheduledDate;

    try {
        const { data } = await axiosClient.post(AppUrls.sendNotification, safe);
        return data?.result ?? true;
    } catch (err) {
        const status = err?.response?.status;
        const detail =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Unknown error";
        throw { status, detail, raw: err?.response?.data, err };
    }
};

/* ========= Options & Search (chuẩn hoá về {label, value} / {id,...}) ========= */

// 1) Notification types: backend trả về danh sách type; map -> {label, value}
export const getNotificationTypes = async () => {
    // EXPECTED: GET AppUrls.notificationTypes -> [{id, name}] hoặc [{value,label}]
    const { data } = await axiosClient.get(AppUrls.notificationTypes);
    const list = data?.result || data || [];
    return list.map((x) => ({
        label: x.label || x.name || x.displayName || `Type #${x.id}`,
        value: x.value ?? x.id,
    }));
};

// 2) Roles: map -> {label, value} (value gửi lên BE)
export const getRoleOptions = async () => {
    // EXPECTED: GET AppUrls.roleOptions -> [{code:'STUDENT', name:'Student'}] hoặc [{id:1,name:'Student'}]
    const { data } = await axiosClient.get(AppUrls.roleOptions);
    const list = data?.result || data || [];
    return list.map((r) => ({
        label: r.name || r.displayName || r.code || `Role #${r.id}`,
        value: r.code ?? r.id, // LƯU Ý: nếu BE yêu cầu ID, đổi thành r.id
    }));
};

// 3) Autocomplete Users: trả về [{id,name,email}]
export const searchUsers = async (query = "", page = 1, size = 10) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchUsers}?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
    const list = data?.result?.items || data?.result || data || [];
    return list.map((u) => ({
        id: u.id,
        name: u.name || u.fullName || u.username,
        email: u.email,
    }));
};

// 4) Autocomplete Courses: trả về [{id,code,title}]
export const searchCourses = async (query = "", page = 1, size = 10) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchCourses}?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
    const list = data?.result?.items || data?.result || data || [];
    return list.map((c) => ({
        id: c.id,
        code: c.code || c.courseCode,
        title: c.title || c.name,
    }));
};

// 5) Autocomplete Programs: trả về [{id,name}]
export const searchPrograms = async (query = "", page = 1, size = 10) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchPrograms}?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
    );
    const list = data?.result?.items || data?.result || data || [];
    return list.map((p) => ({
        id: p.id,
        name: p.name || p.programName,
    }));
};

export const getScheduledNotifications = async () => {
    const { data } = await axiosClient.get(AppUrls.getScheduledNotifications);
    return (data?.result || []).map(normalize);
};
