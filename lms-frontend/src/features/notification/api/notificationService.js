import axiosClient from "@/shared/api/axiosClient";
import AppUrls from "@/shared/constants/urls";

const normalize = (m = {}) => {
    const rawType = (m.type ?? m.notificationType ?? "SYSTEM")
        .toString()
        .toLowerCase();
    const url = m.url || "";

    let uiType = rawType;

    if (url.includes("/assignments")) {
        uiType = "assignment";
    } else if (rawType === "program" || rawType === "course") {
        uiType = "event";
    } else if (rawType === "feedback") {
        uiType = "feedback";
    } else if (!["system", "assignment", "event", "feedback"].includes(uiType)) {
        uiType = "system";
    }

    const rawSeen = m.isSeen ?? m.read ?? m.seen;

    // scheduledDate & receiverRole cho trang quản lý
    const scheduledDate = m.scheduledDate ?? null;
    const receiverRole =
        m.receiverRole ||
        m.receiverRoleCode ||
        m.receiverRoleName ||
        (Array.isArray(m.receiverRoles) ? m.receiverRoles.join(", ") : null) ||
        null;

    return {
        id: m.id,
        title: m.title ?? "",
        content: m.content ?? m.message ?? "",
        isSeen: !!rawSeen,
        type: uiType,
        rawType,
        postedDate: m.postedDate ?? m.date ?? m.createdAt ?? null,
        scheduledDate,
        receiverRole,
        sender: m.sender ?? "System",
        url,
        course: m.course || "",
    };
};

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
    const { data } = await axiosClient.put(AppUrls.markAsSeen(id));
    return data?.result ?? true;
};

/* ===== ADMINIT: SEND ===== */
export const sendNotification = async (payload) => {
    const safe = { ...payload };

    if (safe.severity != null) safe.severity = Number(safe.severity);
    if (safe.notificationTypeId != null)
        safe.notificationTypeId = Number(safe.notificationTypeId);

    if (!safe.url) delete safe.url;
    ["targetRoles", "targetUserIds", "targetCourseIds", "targetProgramIds"].forEach(
        (k) => {
            if (!Array.isArray(safe[k]) || safe[k].length === 0) delete safe[k];
        }
    );
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

// Roles -> [{label, value}]
export const getRoleOptions = async () => {
    const { data } = await axiosClient.get(AppUrls.roleOptions);
    const list = data?.result || data || [];
    return list.map((r) => ({
        label: r.label || r.name || r.displayName || r.code || `Role #${r.id}`,
        value: r.value ?? r.code ?? r.id,
    }));
};

export const searchUsers = async (
    query = "",
    page = 1,
    size = 50,
    signal
) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchUsers}?q=${encodeURIComponent(
            query
        )}&page=${page}&size=${size}`,
        { signal }
    );
    const list = data?.result || [];
    return list.map((u) => ({
        id: u.id,
        name: u.name || u.userName || u.fullName || u.username,
        email: u.email,
    }));
};

export const searchCourses = async (
    query = "",
    page = 1,
    size = 50,
    signal
) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchCourses}?q=${encodeURIComponent(
            query
        )}&page=${page}&size=${size}`,
        { signal }
    );
    const list = data?.result || [];
    return list.map((c) => ({
        id: c.id,
        code: c.code || c.courseCode,
        title: c.title || c.name,
    }));
};

export const searchPrograms = async (
    query = "",
    page = 1,
    size = 50,
    signal
) => {
    const { data } = await axiosClient.get(
        `${AppUrls.searchPrograms}?q=${encodeURIComponent(
            query
        )}&page=${page}&size=${size}`,
        { signal }
    );
    const list = data?.result || [];
    return list.map((p) => ({
        id: p.id,
        name: p.name || p.title || p.programName,
    }));
};

/* ===== ADMINIT: QUEUE & HISTORY ===== */

export const getScheduledNotifications = async () => {
    const { data } = await axiosClient.get(AppUrls.getScheduledNotifications);
    return (data?.result || []).map(normalize);
};

export const getSentNotifications = async () => {
    const { data } = await axiosClient.get(AppUrls.getAdminNotificationHistory);
    return (data?.result || []).map(normalize);
};
