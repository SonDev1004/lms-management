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

//Lấy state làm bài:
export async function fetchAssessment(assignmentId) {
    const local = loadLocal(assignmentId);
    if (
        local &&
        !local.completed &&
        Array.isArray(local.questions) &&
        local.questions.length > 0
    ) {
        return local;
    }

    let startData;
    let quizData;

    // 1) START QUIZ
    try {
        const startRes = await axiosClient.post(
            AppUrls.studentStartQuiz(assignmentId)
        );
        startData = startRes.data?.result || {};
        if (!startData.submissionId) {
            throw new Error("Start quiz không trả về submissionId");
        }
    } catch (e) {
        clearAssessment(assignmentId);
        console.error("Failed to start quiz", e);
        throw new Error("Failed to start quiz");
    }

    // 2) GET QUIZ
    try {
        const quizRes = await axiosClient.get(
            AppUrls.studentGetQuiz(assignmentId)
        );
        quizData = quizRes.data?.result || {};
    } catch (e) {
        clearAssessment(assignmentId);
        console.error("Failed to load quiz", e);
        throw new Error("Failed to load quiz");
    }

    const rawQuestions = quizData.questions || [];

    const questions = rawQuestions.map((q, index) => {
        const id = q.questionId ?? q.id;
        if (id == null) {
            throw new Error(
                `Missing questionId from backend for question index ${index}`
            );
        }
        return {
            id,
            order: q.orderNumber ?? index + 1,
            points: q.points ?? 1,
            meta: {
                title: q.content ?? "",
                type: q.type ?? null,
                audioUrl: q.audioUrl ?? null,
            },
            // BE trả [{ key: "A", text: "cat" }, ...]
            options: q.options || [],
            answer: null,
        };
    });

    const durationMinutes =
        quizData.durationMinutes != null ? quizData.durationMinutes : null;

    const state = {
        assignmentId:
            quizData.assignmentId ??
            startData.assignmentId ??
            Number(assignmentId),
        title: quizData.assignmentTitle ?? "",
        submissionId: startData.submissionId,
        durationMinutes,
        timeLeftSec:
            durationMinutes != null ? durationMinutes * 60 : null,
        currentIndex: 1,
        questions,
        completed: false,
    };

    saveAssessment(assignmentId, state);
    return state;
}

/**
 * Nộp bài:
 *  FE → map { "<assignmentDetailId>": "<selectedKey>" }
 *  Ví dụ: { "7": "A", "8": "C" }
 *  để khớp với submitInternal() trong QuizSubmissionServiceImpl.
 */
// Nộp bài: FE gửi map { "<assignmentDetailId>": "<selectedKey>" }
export async function submitQuiz(assignmentId, submissionId, state) {
    const answers = {};

    (state.questions || []).forEach((q) => {
        const selectedIndex = q.answer;
        if (selectedIndex == null) return;

        const opt = q.options?.[selectedIndex];
        const key =
            opt?.key ??
            opt?.optionKey ??
            opt?.label ??
            null;

        if (key != null && q.id != null) {
            // id = assignmentDetailId
            answers[String(q.id)] = key;
        }
    });

    const res = await axiosClient.post(
        AppUrls.studentSubmitQuiz(assignmentId, submissionId),
        answers            // <-- gửi trực tiếp map
    );

    return res.data?.result ?? res.data;
}

