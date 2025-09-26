import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

import AttendanceTable from './AttendanceTable';
import AttendanceService from '@/features/attendance/api/attendanceService.js';

const attendance_types = [
	{ label: 'Có mặt', value: 1 },
	{ label: 'Đi trễ', value: 2 },
	{ label: 'Vắng', value: 0 },
];

const AttendancePanel = () => {
	const navigate = useNavigate();
	const { sessionId } = useParams();
	const location = useLocation();

	const dateFromSession =
		location.state?.date ||
		new URLSearchParams(location.search).get('date') ||
		null;

	const [selectedDate] = useState(
		dateFromSession ? new Date(dateFromSession) : new Date()
	);
	const [attendanceData, setAttendanceData] = useState([]);
	const [loading, setLoading] = useState(true);

	// lấy danh sách điểm danh của session
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				setLoading(true);
				const data = await AttendanceService.getAttendanceBySession(sessionId);
				if (mounted) setAttendanceData(data);
			} catch (err) {
				console.error('Lỗi load attendance:', err);
			} finally {
				setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [sessionId]);

	// thay đổi trạng thái điểm danh
	const handleAttendanceChange = (studentId, value) => {
		setAttendanceData(prev =>
			prev.map(item =>
				item.id === studentId ? { ...item, attendance: value } : item
			)
		);
	};

	const handleReasonChange = (reason, rowIndex) => {
		setAttendanceData(prev => {
			const newData = [...prev];
			newData[rowIndex].reasonAbsent = reason;
			return newData;
		});
	};

	// lưu điểm danh
	const handleSaveAttendance = async () => {
		try {
			await AttendanceService.markAttendance(sessionId, attendanceData);
			alert('Lưu điểm danh thành công!');
		} catch (err) {
			console.error(err);
			alert('Không lưu được điểm danh');
		}
	};

	return (
		<div className='grid mt-2'>
			<Card title='Bảng điểm danh'>
				<div className='formgrid grid'>
					<div className='field col'>
						<label>Buổi học</label>
						<Calendar value={selectedDate} dateFormat='dd/mm/yy' readOnlyInput />
					</div>
				</div>

				{loading ? (
					<p>Đang tải...</p>
				) : (
					<AttendanceTable
						attendanceList={attendanceData}
						attendance_types={attendance_types}
						handleAttendanceChange={handleAttendanceChange}
						handleReasonChange={handleReasonChange}
						renderFooter={() => null}
					/>
				)}

				<div className='flex justify-content-between mt-4'>
					<Button label='Quay lại' onClick={() => navigate(-1)} />
					<Button label='Lưu' onClick={handleSaveAttendance} />
				</div>
			</Card>
		</div>
	);
};

export default AttendancePanel;
