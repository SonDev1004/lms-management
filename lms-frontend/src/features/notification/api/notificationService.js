import axiosClient from "@/shared/api/axiosClient";
import AppUrls from "@/shared/constants/urls";

/* (Optional) chuẩn hoá notification nếu bạn dùng list */
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

/* ===== USER ===== */
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

/* ===== ADMINIT: SEND ===== */
export const sendNotification = async (payload) => {
    const safe = { ...payload };

    if (safe.severity != null) safe.severity = Number(safe.severity);
    if (safe.notificationTypeId != null) safe.notificationTypeId = Number(safe.notificationTypeId);

    if (!safe.url) delete safe.url;
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
            err?.response?.data?.message || err?.response?.data?.error || err?.message || "Unknown error";
        throw { status, detail, raw: err?.response?.data, err };
    }
};

/* ===== Options & Autocomplete ===== */

// Notification types -> [{label, value}]
export const getNotificationTypes = async () => {
    const { data } = await axiosClient.get(AppUrls.notificationTypes);
    const list = data?.result || data || [];
    return list.map((t) => ({
        label: t.label || t.name || t.displayName || `Type #${t.id}`,
        value: t.value ?? t.id,
    }));
};

// Roles -> [{label, value}]; nếu BE yêu cầu ID role, đổi value: r.id
export const getRoleOptions = async () => {
    const { data } = await axiosClient.get(AppUrls.roleOptions);
    const list = data?.result || data || [];
    return list.map((r) => ({
        label: r.label || r.name || r.displayName || r.code || `Role #${r.id}`,
        value: r.value ?? r.code ?? r.id,
    }));
};

export const searchUsers = async (query = "", page = 1, size = 50, signal) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchUsers}?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { signal }
    );
    const list = data?.result || [];
    return list.map((u) => ({
        id: u.id,
        name: u.name || u.userName || u.fullName || u.username,
        email: u.email,
    }));
};

export const searchCourses = async (query = "", page = 1, size = 50, signal) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchCourses}?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { signal }
    );
    const list = data?.result || [];
    return list.map((c) => ({
        id: c.id,
        code: c.code || c.courseCode,
        title: c.title || c.name,
    }));
};

export const searchPrograms = async (query = "", page = 1, size = 50, signal) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchPrograms}?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { signal }
    );
    const list = data?.result || [];
    return list.map((p) => ({
        id: p.id,
        name: p.name || p.title || p.programName,
    }));
};

export const getScheduledNotifications = async () => {
    const { data } = await axiosClient.get(AppUrls.getScheduledNotifications);
    return (data?.result || []).map(normalize);
};
