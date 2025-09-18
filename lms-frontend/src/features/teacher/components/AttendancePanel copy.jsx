//use and React:
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button } from 'primereact';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

//component
import SessionSelect from '../../session/components/SessionSelect.jsx';
import AttendanceTable from './AttendanceTable';

//Cấu hình 3 loại điểm danh cho 3 nút Radio Button
const attendance_types = [
	{ label: 'Có mặt', value: 'present' },
	{ label: 'Đi trễ', value: 'late' },
	{ label: 'Vắng', value: 'absent' }
];
//mock
import { attendanceData } from '../../../mocks/mockAttendance';

const AttendancePanel = () => {
	const navigate = useNavigate();
	// const { courseId } = useParams();
	const [selectedDate, setSelectedDate] = useState(new Date());

	//Lọc ra session hnay:
	const sessionsToday = attendanceData.sessions.filter(
		session => session.date === new Date().toISOString().split('T')[0]
	);
	const [sessionId, setSessionId] = useState(
		sessionsToday.length === 1 ? sessionsToday[0]?.id : null
	);

	// State cho bảng điểm danh
	const [attendanceList, setAttendanceList] = useState([]);
	useEffect(() => {
		if (!sessionId) return setAttendanceList([]);
		const updated = attendanceData.students.map(student => {
			const attendance = student.attendancelist.find(
				a => a.sessionId === sessionId
			);
			return {
				...student,
				attendance: attendance?.status || 'none',
				reasonAbsent: attendance?.reason || ''
			};
		});
		setAttendanceList(updated);
	}, [sessionId]);
	//Handle
	//Cập nhật trạng thái từng học viên trong state
	const handleAttendanceChange = (studentId, value) => {
		setAttendanceList(prev =>
			prev.map(stu =>
				stu.id === studentId ? { ...stu, attendance: value } : stu
			)
		);
	};
	//Hàm lưu lí do
	const handleReasonChange = (value, rowIndex) => {
		setAttendanceList(prev => {
			const next = [...prev];
			next[rowIndex] = { ...next[rowIndex], reasonAbsent: value };
			return next;
		});
	};
	//Hàm lưu điểm danh
	const handleSaveAttendance = () => {
		console.log('Đã lưu:', attendanceList);
		localStorage.setItem('attendanceList', JSON.stringify(attendanceList));
		alert('Lưu thành công');
	};
	//Hàm Refresh lại trang
	const handleRefresh = () => {
		if (!sessionId) return setAttendanceList([]);
		const updated = attendanceData.students.map(student => {
			const attendance = student.attendancelist.find(
				a => a.sessionId === sessionId
			);
			return {
				...student,
				attendance: attendance?.status || 'none',
				reasonAbsent: attendance?.reason || ''
			};
		});
		setAttendanceList(updated);
	};

	//Header của Card
	const header = () => (
		<div className='flex align-items-center justify-content-between'>
			<span className='text-2xl font-bold'>Bảng điểm danh</span>
			<div className='flex gap-2'>
				<Button
					label='Bảng tổng hợp'
					className='p-button-outlined p-button-info'
				/>
				<Button
					label='QR Code'
					className='p-button-outlined p-button-success'
				/>
			</div>
		</div>
	);

	//renderFooter hiển thi tổng số lượng chuyên cần:
	const renderFooter = typeValue => {
		const total = attendanceList.filter(
			stu => stu.attendance === typeValue
		).length;
		return <span>{total}</span>;
	};

	return (
		<>
			<div className='grid mt-2'>
				<div className='col-9'>
					<Card title={header()}>
						<div className='formgrid grid'>
							<div className='field col'>
								<label htmlFor='session'>Buổi học</label>
								<Calendar
									id='session'
									value={selectedDate}
									dateFormat='dd/mm/yy'
									onChange={e => setSelectedDate(e.value)}
								/>
							</div>
							<div className='field col'>
								<label htmlFor='session'>Ca học</label>
								<InputText
									value={
										attendanceData.sessions.find(
											session =>
												session.date ===
												new Intl.DateTimeFormat(
													'en-CA'
												).format(selectedDate)
										)?.starttime
									}
									readOnly
								/>
							</div>
						</div>
						<AttendanceTable
							attendanceList={attendanceList}
							attendance_types={attendance_types}
							handleAttendanceChange={handleAttendanceChange}
							handleReasonChange={handleReasonChange}
							renderFooter={renderFooter}
						/>
						<div className='flex justify-content-between flex-wrap mt-4'>
							<div className='flex align-items-center justify-content-center'>
								<Button
									label='Quay lại'
									onClick={() => navigate(-1)}
								/>
								<Button
									label='Refresh'
									className='ml-2'
									onClick={() => handleRefresh()}
								/>
							</div>
							<div className='flex align-items-center justify-content-center'>
								<Button
									label='Lưu'
									onClick={() => handleSaveAttendance()}
								/>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</>
	);
};

export default AttendancePanel;
