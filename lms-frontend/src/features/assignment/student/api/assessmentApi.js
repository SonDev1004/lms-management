// src/features/assignment/student/api/assessmentApi.js
import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";

// ===== Local storage helpers =====
const KEY = (assignmentId) => `quiz_state_${assignmentId}`;

export function saveAssessment(assignmentId, state) {
    try {
        localStorage.setItem(KEY(assignmentId), JSON.stringify(state));
    } catch (e) {
        console.warn("Cannot save quiz state", e);
    }
}

export function clearAssessment(assignmentId) {
    try {
        localStorage.removeItem(KEY(assignmentId));
    } catch (e) {
        console.warn("Cannot clear quiz state", e);
    }
}

function loadLocal(assignmentId) {
    try {
        const raw = localStorage.getItem(KEY(assignmentId));
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

// ===== API calls =====

// Lấy state làm bài (ưu tiên state lưu local, nếu không có thì gọi /start để mở bài mới)
export async function fetchAssessment(assignmentId) {
    const local = loadLocal(assignmentId);
    if (local && !local.completed) {
        return local;
    }

    // VERY IMPORTANT: dùng axiosClient để có token
    const res = await axiosClient.post(
        AppUrls.studentStartQuiz(assignmentId)
    );
    const data = res.data?.result;

    const questions = (data.questions || []).map((q, index) => ({
        id: q.questionId,
        order: q.orderNumber ?? index + 1,
        points: q.points ?? 1,
        meta: {
            title: q.content,
            type: q.type,
            audioUrl: q.audioUrl,
        },
        // BE trả options là [{key,text},...]
        options: q.options || [],
        answer: null, // chưa chọn
    }));

    const state = {
        assignmentId: data.assignmentId,
        title: data.assignmentTitle,
        submissionId: data.submissionId,
        durationMinutes: data.durationMinutes ?? null,
        timeLeftSec: data.durationMinutes ? data.durationMinutes * 60 : null,
        currentIndex: 1,
        questions,
        completed: false,
    };

    saveAssessment(assignmentId, state);
    return state;
}

// Nộp bài
export async function submitQuiz(assignmentId, submissionId, state) {
    // Map state => payload BE mong muốn
    const answers = (state.questions || []).map((q) => {
        const selectedIndex = q.answer;
        const selected =
            selectedIndex != null ? q.options[selectedIndex] : null;

        return {
            questionId: q.id,
            // tuỳ BE yêu cầu: ở đây gửi key + index
            selectedOptionKey: selected?.key ?? null,
            selectedOptionIndex:
                selectedIndex != null ? selectedIndex : null,
        };
    });

    const payload = { answers };

    const res = await axiosClient.post(
        AppUrls.studentSubmitQuiz(assignmentId, submissionId),
        payload
    );
    return res.data?.result ?? res.data;
}
