import { useCallback, useMemo, useState } from "react";
import { searchTeachers } from "../mocks/teachers";

/**
 * Hook danh sách giáo viên cho LMS tiếng Anh.
 * - Bộ lọc: q (search), status, dept (khoa/track), subject (môn), emp (loại hợp đồng)
 * - Export CSV
 */
export function useTeachers() {
    const [q, setQ] = useState("");
    const [status, setStatus] = useState(null);  // 'active' | 'on_leave' | 'inactive' | null
    const [dept, setDept] = useState(null);      // 'Young Learners' | 'Adults' | 'IELTS' | 'Business English' | null
    const [subject, setSubject] = useState(null);// ví dụ: 'English - A2', 'IELTS Writing', ...
    const [emp, setEmp] = useState(null);        // 'full-time' | 'part-time' | 'contract' | null

    const data = useMemo(
        () =>
            searchTeachers({
                q: q.trim(),
                status: status ?? "",
                dept: dept ?? "",
                subject: subject ?? "",
                emp: emp ?? "",
            }),
        [q, status, dept, subject, emp]
    );

    const exportCSV = useCallback(() => {
        if (!data.length) return;
        const headers = [
            "id",
            "name",
            "email",
            "department",
            "subjects",
            "employmentType",
            "status",
            "hiredOn",
            "teachingLoad",
            "homeroomOf",
        ];
        const csv = [
            headers.join(","),
            ...data.map((r) =>
                headers
                    .map((h) =>
                        JSON.stringify(
                            h === "subjects" ? (r[h] || []).join("|") : r[h] ?? ""
                        )
                    )
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "teachers.csv";
        a.click();
    }, [data]);

    return {
        data,
        // tiện cho UI select
        options: {
            status: [
                { label: "All Status", value: null },
                { label: "active", value: "active" },
                { label: "on leave", value: "on_leave" },
                { label: "inactive", value: "inactive" },
            ],
            dept: [
                { label: "All Departments", value: null },
                { label: "Young Learners", value: "Young Learners" },
                { label: "Adults", value: "Adults" },
                { label: "IELTS", value: "IELTS" },
                { label: "Business English", value: "Business English" },
            ],
            emp: [
                { label: "All Employment", value: null },
                { label: "full-time", value: "full-time" },
                { label: "part-time", value: "part-time" },
                { label: "contract", value: "contract" },
            ],
        },
        filters: { q, status, dept, subject, emp },
        setFilters: { setQ, setStatus, setDept, setSubject, setEmp },
        exportCSV,
    };
}
