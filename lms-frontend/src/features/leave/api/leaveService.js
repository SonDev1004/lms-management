export const submitLeaveRequest = (payload) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, id: 'LR' + Date.now(), createdAt: new Date().toISOString(), ...payload }), 700);
    });
};

export const fetchLeaveRequestsForStudent = (studentId) => {
    void studentId;
    const now = Date.now();
    const items = [
        { id: 'LR1', studentId: studentId || 'stu1', type: 'sick', reason: 'Sốt cao', status: 'approved', createdAt: new Date(now - 5 * 24 * 3600 * 1000).toISOString() },
        { id: 'LR2', studentId: studentId || 'stu1', type: 'personal', reason: 'Việc gia đình', status: 'pending', createdAt: new Date(now - 2 * 24 * 3600 * 1000).toISOString() }
    ];
    return new Promise((resolve) => setTimeout(() => resolve(items), 400));
};

export const fetchLeaveRequest = (id) => {
    return new Promise((resolve) => setTimeout(() => resolve({ id, studentId: 'stu1', type: 'sick', reason: 'Sốt', status: 'pending', createdAt: new Date().toISOString() }), 300));
};
