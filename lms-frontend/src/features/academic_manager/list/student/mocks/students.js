export const courses = [
    { code: 'GE-A1',      name: 'General English A1 (Beginner)' },
    { code: 'GE-A2',      name: 'General English A2 (Elementary)' },
    { code: 'GE-B1',      name: 'General English B1 (Intermediate)' },
    { code: 'IELTS-INT',  name: 'IELTS Intensive 6.0+' },
    { code: 'IELTS-ADV',  name: 'IELTS Advanced 7.0+' },
    { code: 'TOEIC-700',  name: 'TOEIC Target 700+' },
    { code: 'SPEAK-CLUB', name: 'Speaking Club (Communication)' },
    { code: 'PRON101',    name: 'Pronunciation & Phonics' },
];

export const classes = [
    { label: 'GE A2 – Evening',       value: 'GE A2 – Evening' },
    { label: 'GE B1 – Weekend',       value: 'GE B1 – Weekend' },
    { label: 'IELTS Intensive 6.0+',  value: 'IELTS Intensive 6.0+' },
    { label: 'TOEIC Target 700+',     value: 'TOEIC Target 700+' },
];

export const studentStatusOptions = [
    { label: 'Active',     value: 'active' },
    { label: 'Completed',  value: 'graduated' },
    { label: 'Dropped',    value: 'dropped' },
];

export const mockStudents = [
    {
        id: 'STU001',
        name: 'Nguyễn An',
        email: 'an.nguyen@example.com',
        phone: '+84 909 111 222',
        avatar: 'https://i.pravatar.cc/120?img=5',
        class: 'IELTS Intensive 6.0+',
        status: 'active',
        enrolledOn: '2024-01-15',
        gpa: 6.5,
        courses: ['IELTS-INT', 'SPEAK-CLUB', 'PRON101'],

        address: '123 Main St, City, State 12345',
        emergencyContact: { name: 'Jane Smith', relation: 'Mother', phone: '+1 (555) 987-6543' },

        progress: { 'IELTS-INT': 70, 'SPEAK-CLUB': 20, 'PRON101': 90 },

        attendance: [
            { date: '2024-09-25', course: 'IELTS-INT',  status: 'Present' },
            { date: '2024-09-24', course: 'SPEAK-CLUB', status: 'Present' },
            { date: '2024-09-23', course: 'IELTS-INT',  status: 'Late' },
            { date: '2024-09-20', course: 'PRON101',    status: 'Absent' },
        ],

        grades: {
            'IELTS-INT':  { midterm: 6.0, final: 6.5, assignments: 6.0, total: 6.3 },
            'SPEAK-CLUB': { midterm: 85,  final: 90,  assignments: 88,  total: 88 },
            'PRON101':    { midterm: 80,  final: 86,  assignments: 84,  total: 83 },
        },

        feedback: [
            {
                id: 'fb1',
                teacher: 'Ms. Linda',
                course: 'IELTS-INT',
                sentiment: 'positive',
                date: '2024-09-20',
                note: 'Writing Task 2 tiến bộ rõ; cần giữ nhịp Speaking ổn định.',
            },
            {
                id: 'fb2',
                teacher: 'Mr. Tom',
                course: 'PRON101',
                sentiment: 'improvement',
                date: '2024-09-15',
                note: 'Cải thiện /θ/ và nối âm; luyện shadowing 10 phút mỗi ngày.',
            },
        ],
    },

    {
        id: 'STU002',
        name: 'Trần Minh',
        email: 'minh.tran@example.com',
        phone: '+84 908 222 333',
        avatar: '',
        class: 'GE B1 – Weekend',
        status: 'active',
        enrolledOn: '2024-02-01',
        gpa: 7.2,
        courses: ['GE-B1', 'SPEAK-CLUB'],
        address: '45 River Rd, City, State 10001',
        emergencyContact: { name: 'Trần Thu', relation: 'Sister', phone: '+84 936 555 777' },
        progress: { 'GE-B1': 0, 'SPEAK-CLUB': 0 },
        attendance: [
            { date: '2024-09-25', course: 'GE-B1',      status: 'Present' },
            { date: '2024-09-24', course: 'SPEAK-CLUB', status: 'Present' },
        ],
        grades: {
            'GE-B1':      { midterm: 78, final: 84, assignments: 82, total: 81 },
            'SPEAK-CLUB': { midterm: 75, final: 85, assignments: 80, total: 80 },
        },
        feedback: [
            {
                id: 'fb3',
                teacher: 'Ms. Hương',
                course: 'GE-B1',
                sentiment: 'positive',
                date: '2024-09-18',
                note: 'Từ vựng chủ đề Travel tốt; cần luyện thì quá khứ.',
            },
        ],
    },

    {
        id: 'STU003',
        name: 'Lê Hoa',
        email: 'hoa.le@example.com',
        phone: '+84 903 444 555',
        avatar: 'https://i.pravatar.cc/120?img=12',
        class: 'TOEIC Target 700+',
        status: 'graduated',
        enrolledOn: '2024-05-15',
        gpa: 805, // điểm TOEIC
        courses: ['TOEIC-700', 'PRON101'],
        address: '88 Ocean Ave, City, State 22002',
        emergencyContact: { name: 'Lê Nam', relation: 'Father', phone: '+84 912 333 444' },
        progress: { 'TOEIC-700': 0, 'PRON101': 0 },
        attendance: [
            { date: '2024-07-20', course: 'TOEIC-700', status: 'Present' },
            { date: '2024-07-18', course: 'PRON101',   status: 'Present' },
        ],
        grades: {
            'TOEIC-700': { midterm: 720, final: 810, assignments: 790, total: 805 },
            'PRON101':   { midterm: 88,  final: 92,  assignments: 90,  total: 90 },
        },
        feedback: [
            {
                id: 'fb4',
                teacher: 'Mr. David',
                course: 'TOEIC-700',
                sentiment: 'positive',
                date: '2024-07-19',
                note: 'Reading speed cải thiện; tiếp tục luyện đề mỗi tuần.',
            },
        ],
    },

    {
        id: 'STU004',
        name: 'Phạm Quang',
        email: 'quang.pham@example.com',
        phone: '+84 916 666 777',
        avatar: 'https://i.pravatar.cc/120?img=32',
        class: 'GE A2 – Evening',
        status: 'dropped',
        enrolledOn: '2024-03-10',
        gpa: 5.8,
        courses: ['GE-A2'],
        address: '12 Lake View, City, State 30003',
        emergencyContact: { name: 'Phạm Bình', relation: 'Brother', phone: '+84 938 000 222' },
        progress: { 'GE-A2': 0 },
        attendance: [
            { date: '2024-06-05', course: 'GE-A2', status: 'Absent' },
            { date: '2024-06-03', course: 'GE-A2', status: 'Late' },
        ],
        grades: {
            'GE-A2': { midterm: 58, final: 0, assignments: 60, total: 39 },
        },
        feedback: [
            {
                id: 'fb5',
                teacher: 'Ms. Trang',
                course: 'GE-A2',
                sentiment: 'improvement',
                date: '2024-06-06',
                note: 'Nên sắp xếp lại lịch; đề xuất chuyển ca cuối tuần.',
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

export function getStudentById(id) {
    return mockStudents.find((s) => s.id === id);
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
