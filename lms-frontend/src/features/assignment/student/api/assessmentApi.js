const LS_KEY = 'assignment_student_state_v1';

export function fetchAssessment() {
    return new Promise((res) => setTimeout(() => res(JSON.parse(localStorage.getItem(LS_KEY) || 'null')), 300));
}

export function saveAssessment(state) {
    return new Promise((res) => {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
        setTimeout(() => res({ ok: true }), 250);
    });
}

export function clearAssessment() {
    localStorage.removeItem(LS_KEY);
}
