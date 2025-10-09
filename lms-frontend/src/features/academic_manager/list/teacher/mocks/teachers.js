// mocks/teachers.js  — English LMS version

// Departments (tracks)
export const departments = [
    { label: "Young Learners", value: "yl" },
    { label: "Adults", value: "adults" },
    { label: "IELTS", value: "ielts" },
    { label: "Business English", value: "biz" },
];

// Status options
export const teacherStatusOptions = [
    { label: "Active", value: "active" },
    { label: "On leave", value: "on_leave" },
    { label: "Inactive", value: "inactive" },
];

// Employment types
export const employmentTypes = [
    { label: "Full-time", value: "full" },
    { label: "Part-time", value: "part" },
    { label: "Contract", value: "contract" },
];

// ===== Mock store =====
let _store = [
    {
        id: "T001",
        name: "John Smith",
        email: "john.smith@center.edu",
        phone: "0901 234 567",
        avatar: "",
        department: "adults",
        subjects: ["ENG-A2", "ENG-B1", "Pronunciation"],
        employmentType: "full",
        status: "active",
        hiredOn: "2021-08-15",
        teachingLoad: 18,
        certifications: ["TESOL"],
        homeroomOf: "Class B",
    },
    {
        id: "T002",
        name: "Mary Johnson",
        email: "mary.johnson@center.edu",
        phone: "0902 345 678",
        avatar: "",
        department: "ielts",
        subjects: ["IELTS-Reading", "IELTS-Writing"],
        employmentType: "part",
        status: "active",
        hiredOn: "2022-01-10",
        teachingLoad: 12,
        certifications: ["CELTA"],
        homeroomOf: "",
    },
    {
        id: "T003",
        name: "David Wilson",
        email: "david.wilson@center.edu",
        phone: "0903 456 789",
        avatar: "",
        department: "yl",
        subjects: ["KIDS-PreA1", "Phonics"],
        employmentType: "full",
        status: "on_leave",
        hiredOn: "2020-05-20",
        teachingLoad: 16,
        certifications: ["TKT Young Learners"],
        homeroomOf: "Class A",
    },
    {
        id: "T004",
        name: "Sophia Nguyen",
        email: "sophia.nguyen@center.edu",
        phone: "0904 567 890",
        avatar: "",
        department: "biz",
        subjects: ["BE-Presentation", "BE-Email"],
        employmentType: "contract",
        status: "active",
        hiredOn: "2023-03-01",
        teachingLoad: 8,
        certifications: ["Business English Cert"],
        homeroomOf: "",
    },
    {
        id: "T005",
        name: "Liam Tran",
        email: "liam.tran@center.edu",
        phone: "0905 678 901",
        avatar: "",
        department: "adults",
        subjects: ["ENG-B2", "Speaking-Club"],
        employmentType: "part",
        status: "inactive",
        hiredOn: "2019-11-02",
        teachingLoad: 0,
        certifications: ["TESOL"],
        homeroomOf: "",
    },
    {
        id: "T006",
        name: "Olivia Pham",
        email: "olivia.pham@center.edu",
        phone: "0906 789 012",
        avatar: "",
        department: "ielts",
        subjects: ["IELTS-Listening", "IELTS-Speaking"],
        employmentType: "full",
        status: "active",
        hiredOn: "2022-09-07",
        teachingLoad: 20,
        certifications: ["CELTA", "DELTA M1"],
        homeroomOf: "Class C",
    },
    {
        id: "T007",
        name: "Ethan Le",
        email: "ethan.le@center.edu",
        phone: "0907 890 123",
        avatar: "",
        department: "yl",
        subjects: ["KIDS-A1", "Storytelling"],
        employmentType: "part",
        status: "active",
        hiredOn: "2023-06-12",
        teachingLoad: 10,
        certifications: ["TKT"],
        homeroomOf: "",
    },
    {
        id: "T008",
        name: "Emma Vo",
        email: "emma.vo@center.edu",
        phone: "0908 901 234",
        avatar: "",
        department: "biz",
        subjects: ["BE-Negotiation", "BE-Writing"],
        employmentType: "contract",
        status: "active",
        hiredOn: "2024-01-05",
        teachingLoad: 6,
        certifications: ["BEC Higher"],
        homeroomOf: "",
    },
    {
        id: "T009",
        name: "Noah Phan",
        email: "noah.phan@center.edu",
        phone: "0909 012 345",
        avatar: "",
        department: "adults",
        subjects: ["ENG-A1", "ENG-A2"],
        employmentType: "full",
        status: "active",
        hiredOn: "2020-10-18",
        teachingLoad: 19,
        certifications: ["TESOL"],
        homeroomOf: "Class D",
    },
    {
        id: "T010",
        name: "Ava Dang",
        email: "ava.dang@center.edu",
        phone: "0910 123 456",
        avatar: "",
        department: "ielts",
        subjects: ["IELTS-Overall", "IELTS-Reading"],
        employmentType: "part",
        status: "on_leave",
        hiredOn: "2021-04-09",
        teachingLoad: 8,
        certifications: ["CELTA"],
        homeroomOf: "",
    },
];

// ===== Utilities =====

// normalize for backward-compat if code cũ truyền 'resigned'
const normalizeStatus = (s) => (s === "resigned" ? "inactive" : s);

export function searchTeachers({ q = "", status = "", dept = "", subject = "", emp = "" }) {
    const s = q.trim().toLowerCase();
    const st = normalizeStatus(status);

    return _store.filter((t) => {
        const okQ =
            !s ||
            [t.id, t.name, t.email, t.phone, t.department, ...(t.subjects || [])]
                .join(" ")
                .toLowerCase()
                .includes(s);

        const okSt = !st || t.status === st;
        const okDept = !dept || t.department === dept;
        const okSub = !subject || (t.subjects || []).includes(subject);
        const okEmp = !emp || t.employmentType === emp;

        return okQ && okSt && okDept && okSub && okEmp;
    });
}

export function upsertTeacher(t) {
    const i = _store.findIndex((x) => x.id === t.id);
    if (i >= 0) _store[i] = { ..._store[i], ...t };
    else _store.push(t);
    return t;
}

export function removeTeacher(id) {
    _store = _store.filter((x) => x.id !== id);
}
