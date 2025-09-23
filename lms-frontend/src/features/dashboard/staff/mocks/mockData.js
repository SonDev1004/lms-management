export const summary = {
    totalStudents: 2847,
    activeStudents: 1923,
    openCourses: 47,
    monthlyRevenue: 54230
};

export const enrollmentOverTime = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    newEnrollments: [80, 120, 160, 200, 260, 320],
    completions: [20, 40, 60, 90, 120, 150]
};

export const levelDistribution = {
    labels: ['Beginner','Intermediate','Advanced'],
    values: [45, 35, 20]
};

export const classesPerTeacher = {
    labels: ['Dr. Smith','Ms. Davis','Dr. Brown'],
    values: [8, 12, 9]
};

export const recentActivities = [
    { id:1, type:'alert', title:'Late Attendance Alert', desc: 'John Smith was 15 minutes late to Advanced React class', time:'2 hours ago' },
    { id:2, type:'registration', title:'New Student Registration', desc: 'Sarah Johnson enrolled in English for Beginners', time:'4 hours ago' },
    { id:3, type:'feedback', title:'Course Feedback Submitted', desc: 'Mike Davis submitted feedback for Grammar Foundations', time:'6 hours ago' },
    { id:4, type:'completion', title:'Course Completed', desc: 'Emma Wilson completed UI/UX Design course', time:'1 day ago' },
    { id:5, type:'material', title:'New Material Uploaded', desc: 'Listening practice set uploaded to TOEIC Prep', time:'1 day ago' }
];

export const upcomingActivities = [
    { id:1, title:'1:1 with Ms. Davis', datetime:'2025-09-20 09:00', meta:'Room B2 - 30 mins' },
    { id:2, title:'Placement test - Group A', datetime:'2025-09-20 11:00', meta:'Lab 1 - 40 students' },
    { id:3, title:'Faculty meeting', datetime:'2025-09-21 14:00', meta:'Conference Room - 1 hour' },
    { id:4, title:'Parent-teacher call', datetime:'2025-09-22 10:00', meta:'Phone - 15 mins' },
    { id:5, title:'English Club Demo', datetime:'2025-09-23 16:00', meta:'Auditorium - 45 mins' }
];

export const newStudents = [
    { id: 'S1', name:'Alice Johnson', email:'alice.johnson@email.com', course:'Advanced Speaking', progress:75, status:'Active', joinDate:'2024-01-15' },
    { id: 'S2', name:'Bob Smith', email:'bob.smith@email.com', course:'Grammar Foundations', progress:45, status:'Active', joinDate:'2024-01-20' },
    { id: 'S3', name:'Carol Davis', email:'carol.davis@email.com', course:'English for Beginners', progress:90, status:'Completed', joinDate:'2024-01-10' },
    { id: 'S4', name:'David Wilson', email:'david.wilson@email.com', course:'Business English', progress:30, status:'Active', joinDate:'2024-01-25' },
    { id: 'S5', name:'Eva Brown', email:'eva.brown@email.com', course:'Pronunciation Workshop', progress:60, status:'Active', joinDate:'2024-01-18' }
];
export const enrollmentMock = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    newEnrollments: [80, 120, 160, 200, 260, 320],
    completions: [20, 40, 60, 90, 120, 150],
};
export const mockLeaveRequests = [
    {
        id: 1,
        staff: "Nguyen Van A",
        reason: "Family emergency",
        date: "2025-09-23",
        status: "pending",
    },
    {
        id: 2,
        staff: "Tran Thi B",
        reason: "Medical leave",
        date: "2025-09-24",
        status: "pending",
    },
    {
        id: 3,
        staff: "Le Van C",
        reason: "Personal leave",
        date: "2025-09-25",
        status: "approved",
    },
    {
        id: 4,
        staff: "Pham Thi D",
        reason: "Conference attendance",
        date: "2025-09-26",
        status: "rejected",
    },
];