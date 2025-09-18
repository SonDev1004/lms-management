// attendance.js

// Dữ liệu điểm danh cho cả khóa học
export const attendanceData = {
	sessions: [
		// Danh sách các buổi học
		{
			id: 241,
			order: 1,
			date: '2025-09-15',
			starttime: '19:00',
			endtime: '21:00',
			isabsent: false
		},
		{
			id: 256,
			order: 2,
			date: '2025-09-17',
			starttime: '19:00',
			endtime: '21:00',
			isabsent: false
		},
		{
			id: 298,
			order: 3,
			date: '2025-09-19',
			starttime: '19:00',
			endtime: '21:00',
			isabsent: false
		}
	],
	students: [
		{
			id: 101,
			code: 'HS001',
			firstname: 'Nguyen',
			lastname: 'Van A',
			gender: 1,
			dateofbirth: '2004-01-01',
			avatar: 'https://i.pravatar.cc/150?img=1',
			attendancelist: [2, 1, 0],
			note: ''
		},
		{
			id: 102,
			code: 'HS002',
			firstname: 'Tran',
			lastname: 'Thi B',
			gender: 0,
			dateofbirth: '2005-02-02',
			avatar: 'https://i.pravatar.cc/150?img=2',
			attendancelist: [0, 1, 1],
			note: ''
		},
		{
			id: 103,
			code: 'HS003',
			firstname: 'Le',
			lastname: 'Van C',
			gender: 1,
			dateofbirth: '2003-05-09',
			avatar: 'https://i.pravatar.cc/150?img=3',
			attendancelist: [1, 1, 1],
			note: ''
		}
	]
};

// Dữ liệu điểm danh cho một buổi học cụ thể
export const singleAttendanceData = [
	{
		id: 101,
		code: 'HS001',
		firstname: 'Nguyen',
		lastname: 'Van A',
		gender: 1,
		dateofbirth: '2004-01-01',
		avatar: 'https://i.pravatar.cc/150?img=1',
		attendance: 1,
		note: ''
	},
	{
		id: 102,
		code: 'HS002',
		firstname: 'Tran',
		lastname: 'Thi B',
		gender: 0,
		dateofbirth: '2005-02-02',
		avatar: 'https://i.pravatar.cc/150?img=2',
		attendance: 0,
		note: ''
	},
	{
		id: 103,
		code: 'HS003',
		firstname: 'Le',
		lastname: 'Van C',
		gender: 1,
		dateofbirth: '2003-05-09',
		avatar: 'https://i.pravatar.cc/150?img=3',
		attendance: 2,
		note: ''
	}
];

// Dữ liệu điểm danh cho một buổi học cụ thể (chưa có ai điểm danh)
export const singleEmptyAttendanceData = [
	{
		id: 101,
		code: 'HS001',
		firstname: 'Nguyen',
		lastname: 'Van A',
		gender: 1,
		dateofbirth: '2004-01-01',
		avatar: 'https://i.pravatar.cc/150?img=1',
		note: ''
	},
	{
		id: 102,
		code: 'HS002',
		firstname: 'Tran',
		lastname: 'Thi B',
		gender: 0,
		dateofbirth: '2005-02-02',
		avatar: 'https://i.pravatar.cc/150?img=2',
		note: ''
	},
	{
		id: 103,
		code: 'HS003',
		firstname: 'Le',
		lastname: 'Van C',
		gender: 1,
		dateofbirth: '2003-05-09',
		avatar: 'https://i.pravatar.cc/150?img=3',
		note: ''
	}
];
