// attendance.js

export const attendanceData = {
    sessions: [
        // Danh sách các buổi học
        { id: 1, order: 1, date: "2025-09-17", starttime: "08:00", endtime: "09:30", isabsent: false },
        { id: 2, order: 2, date: "2025-09-17", starttime: "10:00", endtime: "11:30", isabsent: false },
        { id: 3, order: 3, date: "2025-09-17", starttime: "13:00", endtime: "14:30", isabsent: false }
    ],
    students: [
        {
            id: 101,
            code: "HS001",
            firstname: "Nguyen",
            lastname: "Van A",
            gender: "M",
            dateofbirth: "2004-01-01",
            avatar: "https://i.pravatar.cc/150?img=1",
            attendancelist: [1, 0, 1],
            reasonAbsent: ["", "Bị bệnh", ""]
        },
        {
            id: 102,
            code: "HS002",
            firstname: "Tran",
            lastname: "Thi B",
            gender: "F",
            dateofbirth: "2005-02-02",
            avatar: "https://i.pravatar.cc/150?img=2",
            attendancelist: [0, 0, 1],
            reasonAbsent: ["Bị bệnh", "Bị bệnh", ""]
        },
        {
            id: 103,
            code: "HS003",
            firstname: "Le",
            lastname: "Van C",
            gender: "M",
            dateofbirth: "2003-05-09",
            avatar: "https://i.pravatar.cc/150?img=3",
            attendancelist: [1, 1, 0],
            reasonAbsent: ["", "", "Có việc"]
        }
    ]
};
