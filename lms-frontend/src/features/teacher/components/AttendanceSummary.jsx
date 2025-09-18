import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { useEffect, useState } from 'react';

import { attendanceData } from '../../../mocks/mockAttendance';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';

const AttendanceSummary = () => {
	const [sessions, setSessions] = useState([]);
	const [students, setStudents] = useState([]);

	useEffect(() => {
		setSessions(attendanceData.sessions);
		setStudents(attendanceData.students);
	}, []);

	// Header của Card
	const header = () => (
		<div className='flex align-items-center justify-content-between'>
			<span className='text-2xl font-bold'>Bảng điểm danh toàn khóa</span>
		</div>
	);

	// Hàm format ngày thành dd/mm
	const shortDate = date => {
		const d = new Date(date);
		return new Intl.DateTimeFormat('vi-VN', {
			day: '2-digit',
			month: '2-digit'
		})
			.format(d)
			.replace(/-/g, '/');
	};

	// Hàm format icon cho điểm danh
	const formatIcon = value => {
		switch (value) {
			case 0:
				return (
					<i className='pi pi-times' style={{ color: '#d9534f' }}></i>
				);
			case 1:
				return (
					<i className='pi pi-check' style={{ color: '#5cb85c' }}></i>
				);
			case 2:
				return (
					<i className='pi pi-clock' style={{ color: '#f0ad4e' }}></i>
				);
		}
	};

	return (
		<>
			<div className='grid mt-2'>
				<div className='col-9'>
					<Card title={header()}>
						<DataTable value={students}>
							<Column header='Mã HV' field='code' />
							<Column
								header='Họ tên'
								body={st => `${st.firstname} ${st.lastname}`}
							/>
							{sessions.map((ss, index) => (
								<Column
									header={shortDate(ss.date)}
									body={st =>
										formatIcon(st.attendancelist[index])
									}
								/>
							))}
						</DataTable>
					</Card>
				</div>
			</div>
		</>
	);
};

export default AttendanceSummary;
