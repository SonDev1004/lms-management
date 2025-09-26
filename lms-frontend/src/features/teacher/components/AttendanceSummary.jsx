import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AttendanceService from '@/features/attendance/api/attendanceService.js';

const AttendanceSummary = () => {
	const [summary, setSummary] = useState(null);
	const { courseId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const data = await AttendanceService.getAttendanceSummary(courseId);
			setSummary(data);
		})();
	}, [courseId]);

	if (!summary) return <p>Đang tải...</p>;

	return (
		<div className='mt-2'>
			<Card title='Bảng điểm danh toàn khóa'>
				<DataTable value={summary.students}>
					<Column field='code' header='Mã HV' />
					<Column header='Họ tên' body={st => `${st.firstname} ${st.lastname}`} />
					{summary.sessions.map(ss => (
						<Column
							key={ss.id}
							header={new Date(ss.date).toLocaleDateString('vi-VN')}
							body={st => {
								switch (st.attendances[ss.id]) {
									case 0:
										return <i className='pi pi-times' style={{ color: '#d9534f' }} />;
									case 1:
										return <i className='pi pi-check' style={{ color: '#5cb85c' }} />;
									case 2:
										return <i className='pi pi-clock' style={{ color: '#f0ad4e' }} />;
									default:
										return '-';
								}
							}}
						/>
					))}
				</DataTable>
			</Card>
			<Button className='mt-2' label='Quay lại' onClick={() => navigate(-1)} />
		</div>
	);
};

export default AttendanceSummary;
