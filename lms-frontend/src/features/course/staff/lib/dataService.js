import { courses as allCourses } from '../mocks/courses.js';

export const dataService = {
    getStats: () =>
        new Promise((resolve) => {
            const total = allCourses.length;
            const active = allCourses.filter((c) => c.status === 'active').length;
            const inactive = total - active;

            // Có thể tính % enroll (enrolled/capacity) thay cho avgScore
            const avgEnrollment = total
                ? Number(
                    (
                        allCourses.reduce((sum, c) => sum + (c.enrolled || 0), 0) / total
                    ).toFixed(1)
                )
                : 0;

            setTimeout(() => resolve({ total, active, inactive, avgEnrollment }), 200);
        }),

    getCourses: (query = '') =>
        new Promise((resolve) => {
            const q = query.trim().toLowerCase();
            const filtered = !q
                ? allCourses
                : allCourses.filter((c) => {
                    const id = c.id?.toLowerCase() || '';
                    const title = c.title?.toLowerCase() || '';
                    const teacher = c.teacher?.toLowerCase() || '';
                    return id.includes(q) || title.includes(q) || teacher.includes(q);
                });
            setTimeout(() => resolve(filtered), 250);
        }),
};
