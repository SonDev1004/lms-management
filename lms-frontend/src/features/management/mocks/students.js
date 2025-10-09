// src/features/management/mocks/students.js

export const courses = [
    { code: 'CS101', name: 'Introduction to Programming' },
    { code: 'MATH201', name: 'Calculus II' },
    { code: 'PHYS101', name: 'Physics I' },
    { code: 'BIO101', name: 'Biology I' },
    { code: 'CHEM101', name: 'General Chemistry' },
    { code: 'STAT201', name: 'Statistics' },
];

export const classes = [
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Biology', value: 'Biology' },
];

export const studentStatusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Graduated', value: 'graduated' },
    { label: 'Dropped', value: 'dropped' },
];

export const mockStudents = [
    {
        id: 'STU001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://i.pravatar.cc/120?img=3',
        class: 'Computer Science',
        status: 'active',
        enrolledOn: '2024-01-15',
        gpa: 3.85,
        courses: ['CS101', 'MATH201', 'PHYS101'],

        // Attendance records
        attendance: [
            { date: '2024-09-25', course: 'CS101', status: 'Present' },
            { date: '2024-09-25', course: 'MATH201', status: 'Present' },
            { date: '2024-09-24', course: 'PHYS101', status: 'Present' },
            { date: '2024-09-23', course: 'CS101', status: 'Late' },
            { date: '2024-09-20', course: 'MATH201', status: 'Absent' },
        ],

        // Grade book
        grades: {
            CS101:   { midterm: 88, final: 92, assignments: 85, total: 89 },
            MATH201: { midterm: 76, final: 82, assignments: 78, total: 79 },
            PHYS101: { midterm: 94, final: 96, assignments: 88, total: 93 },
        },

        // Teacher feedback
        feedback: [
            {
                id: 'fb1',
                teacher: 'Dr. Johnson',
                course: 'CS101',
                sentiment: 'positive',
                date: '2024-09-20',
                note: 'Excellent performance in programming assignments. Shows great potential.',
            },
            {
                id: 'fb2',
                teacher: 'Prof. Smith',
                course: 'MATH201',
                sentiment: 'improvement',
                date: '2024-09-15',
                note: 'Needs improvement in calculus fundamentals. Recommend additional practice.',
            },
        ],
    },

    {
        id: 'STU002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 431-9876',
        avatar: '',
        class: 'Biology',
        status: 'active',
        enrolledOn: '2024-02-01',
        gpa: 3.55,
        courses: ['BIO101', 'CHEM101'],
        attendance: [
            { date: '2024-09-25', course: 'BIO101', status: 'Present' },
            { date: '2024-09-24', course: 'CHEM101', status: 'Present' },
        ],
        grades: {
            BIO101:  { midterm: 81, final: 86, assignments: 83, total: 83 },
            CHEM101: { midterm: 78, final: 80, assignments: 75, total: 78 },
        },
        feedback: [],
    },

    {
        id: 'STU003',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1 (555) 733-1212',
        avatar: 'https://i.pravatar.cc/120?img=12',
        class: 'Mathematics',
        status: 'graduated',
        enrolledOn: '2023-09-01',
        gpa: 3.90,
        courses: ['MATH201', 'STAT201'],
        attendance: [
            { date: '2024-05-10', course: 'MATH201', status: 'Present' },
            { date: '2024-05-08', course: 'STAT201', status: 'Present' },
        ],
        grades: {
            MATH201: { midterm: 94, final: 96, assignments: 92, total: 94 },
            STAT201: { midterm: 90, final: 95, assignments: 93, total: 93 },
        },
        feedback: [
            {
                id: 'fb3',
                teacher: 'Dr. Lee',
                course: 'STAT201',
                sentiment: 'positive',
                date: '2024-05-09',
                note: 'Strong analytical thinking and consistent performance.',
            },
        ],
    },
];

export function searchStudents({ q = '', status = '', cls = '' }) {
    q = q.trim().toLowerCase();
    return mockStudents.filter((s) => {
        const matchQ = !q || [s.name, s.id, s.class].some((v) => String(v).toLowerCase().includes(q));
        const matchStatus = !status || s.status === status;
        const matchClass = !cls || s.class === cls;
        return matchQ && matchStatus && matchClass;
    });
}

export function upsertStudent(stu) {
    const i = mockStudents.findIndex((s) => s.id === stu.id);
    if (i >= 0) mockStudents[i] = { ...mockStudents[i], ...stu };
    else mockStudents.unshift(stu);
    return stu;
}

export function removeStudent(id) {
    const i = mockStudents.findIndex((s) => s.id === id);
    if (i >= 0) mockStudents.splice(i, 1);
}
