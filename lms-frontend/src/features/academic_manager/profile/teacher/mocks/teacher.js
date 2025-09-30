export const teachers = [
    {
        id: 'T001',
        code: 'T001',
        name: 'Jane Nguyen',
        email: 'jane.nguyen@example.com',
        department: 'Mathematics',
        subjects: ['MATH101', 'MATH201'],
        status: 'active',
        hiredDate: '2022-08-01',
        employment: 'Full-time',
        phone: '+84 909 111 222',
        title: 'Senior Lecturer – Math',
        avatar: 'https://i.pravatar.cc/150?img=5',
        address: '18/12, Hóc Môn, TP.HCM',
        emergency: { name: 'John Nguyen (Brother)', phone: '+84 912 345 678' },
        certificates: [
            { id: 1, name: 'Teaching Certificate', issuedAt: '2022-01-10', expiresAt: '2026-01-10', status: 'valid' },
            { id: 2, name: 'TESOL', issuedAt: '2021-05-02', expiresAt: '2025-05-02', status: 'expiring' }
        ],
        subjectsDetail: [
            { code: 'MATH101', name: 'Calculus I', level: 'Undergrad' },
            { code: 'MATH201', name: 'Linear Algebra', level: 'Undergrad' }
        ],
        workload: { weeklyHours: 18, classCount: 3, campusCount: 2 },
        classes: [
            { id: 'C-101', subject: 'MATH101', course: 'Calculus I', term: 'Fall 2024', students: 32, schedule: 'Mon 08:00–10:00 | R201', campus: 'Main' },
            { id: 'C-201', subject: 'MATH201', course: 'Linear Algebra', term: 'Fall 2024', students: 28, schedule: 'Wed 09:00–11:00 | R305', campus: 'City' },
            { id: 'C-102', subject: 'MATH101', course: 'Calculus I', term: 'Fall 2024', students: 30, schedule: 'Fri 13:00–15:00 | R202', campus: 'Main' }
        ],
        sessions: [
            { id: 1, date: '2024-09-25', course: 'Calculus I', classId: 'C-101', session: 'Week 3', submitted: true, updatedAt: '2024-09-25 10:15' },
            { id: 2, date: '2024-09-24', course: 'SPEAK-CLUB', classId: 'S-21', session: 'Week 3', submitted: true, updatedAt: '2024-09-24 17:05' },
            { id: 3, date: '2024-09-23', course: 'Calculus I', classId: 'C-101', session: 'Week 3', submitted: false, updatedAt: null },
            { id: 4, date: '2024-09-20', course: 'Linear Algebra', classId: 'C-201', session: 'Week 2', submitted: false, updatedAt: null }
        ],
        grading: [
            { id: 'G1', course: 'Calculus I', assessment: 'Midterm', due: '2024-10-15', submitted: 32, total: 32, status: 'completed', avg: 72 },
            { id: 'G2', course: 'Linear Algebra', assessment: 'Assignment 1', due: '2024-10-01', submitted: 24, total: 28, status: 'inprogress', avg: 68 },
            { id: 'G3', course: 'Linear Algebra', assessment: 'Midterm', due: '2024-11-05', submitted: 0, total: 28, status: 'overdue', avg: null }
        ],
        feedback: [
            { id: 'F1', author: 'Ms. Linda', class: 'MATH101', tag: 'positive', note: 'Engaging lectures, punctual submissions.', date: '2024-09-20' },
            { id: 'F2', author: 'Mr. Tom', class: 'MATH201', tag: 'improvement', note: 'Clarify matrix proofs; more worked examples.', date: '2024-09-15' }
        ],
        documents: [
            { id: 'D1', name: 'CV_JaneNguyen.pdf', type: 'CV', issuedAt: '2024-01-01', expiresAt: null, status: 'n/a' },
            { id: 'D2', name: 'TESOL_Cert.pdf', type: 'Certificate', issuedAt: '2021-05-02', expiresAt: '2025-05-02', status: 'expiring' }
        ]
    },
    {
        id: 'T002',
        code: 'T002',
        name: 'Anh Tran',
        email: 'anh.tran@example.com',
        department: 'Physics',
        subjects: ['PHYS101'],
        status: 'leave',
        hiredDate: '2023-02-01',
        employment: 'Part-time',
        phone: '+84 987 654 321',
        avatar: 'https://i.pravatar.cc/150?img=12'
    }
];

// helper to find by id/code
export const findTeacher = (id) =>
    teachers.find(t => t.id === id || t.code === id) || teachers[0];
