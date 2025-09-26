import { programs as allPrograms } from "../mocks/programs.js";

export const programService = {
    getStats: () =>
        new Promise((resolve) => {
            const total = allPrograms.length;
            const active = allPrograms.filter((p) => p.status === "active").length;
            const inactive = total - active;
            const avgCourses = total
                ? Number(
                    (
                        allPrograms.reduce((s, p) => s + (p.totalCourses || 0), 0) / total
                    ).toFixed(1)
                )
                : 0;
            setTimeout(() => resolve({ total, active, inactive, avgEnrollment: avgCourses }), 200);
        }),

    getPrograms: (query = "", filters = {}) =>
        new Promise((resolve) => {
            const q = query.trim().toLowerCase();
            const { category, level, status } = filters;

            const filtered = allPrograms.filter((p) => {
                const okQ =
                    !q ||
                    p.id.toLowerCase().includes(q) ||
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.level.toLowerCase().includes(q);
                const okCat = !category || p.category === category;
                const okLvl = !level || p.level === level;
                const okStt = !status || p.status === status;
                return okQ && okCat && okLvl && okStt;
            });

            setTimeout(() => resolve(filtered), 250);
        }),
};
