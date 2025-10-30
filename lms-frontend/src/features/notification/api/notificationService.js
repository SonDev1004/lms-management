import api from "@/shared/api/axiosClient";
import AppUrls from "@/shared/constants/urls";

// === USER ===
export const getMyNotifications = async () => {
    const { data } = await api.get(AppUrls.getMyNotifications);
    return data.result;
};

export const getUnseenNotifications = async () => {
    const { data } = await api.get(AppUrls.getUnseenNotifications);
    return data.result;
};

export const markAsSeen = async (id) => {
    await api.put(AppUrls.markAsSeen(id));
};

// === ADMINIT ===
// payload chuẩn (BE đã làm):
// {
//   "title": "string",
//   "content": "html/text",
//   "severity": 1,
//   "url": "/path",
//   "notificationTypeId": 1,
//   "broadcast": false,
//   "targetRoles": ["STUDENT","TEACHER","STAFF"],
//   "targetUserIds": [1,2],
//   "targetCourseIds": [10,11],
//   "targetProgramIds": [7],
//   "scheduledDate": "YYYY-MM-DDTHH:mm:ss" // LocalDateTime
// }
export const sendNotification = async (payload) => {
    const { data } = await api.post(AppUrls.sendNotification, payload);
    return data;
};

export const getScheduledNotifications = async () => {
    const { data } = await api.get(AppUrls.getScheduledNotifications);
    return data.result;
};
