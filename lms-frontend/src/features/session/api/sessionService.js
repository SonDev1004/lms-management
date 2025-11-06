import { AppUrls } from "@/shared/constants/index.js";
import axiosClient from "@/shared/api/axiosClient.js";

async function getSessionsByCourse(courseId) {
    const url = AppUrls.getCourseSessions(courseId);
    try {
        const res = await axiosClient.get(url);
        return res.data?.result ?? [];
    } catch (err) {
        console.error("Lỗi khi tải danh sách buổi học:", err);
        throw err;
    }
}

const SessionService = {
    getSessionsByCourse,
};

export default SessionService;
