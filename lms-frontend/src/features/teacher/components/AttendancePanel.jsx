//use and React:
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Button } from 'primereact';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

//component
import SessionSelect from '../../session/components/SessionSelect.jsx';
import AttendanceTable from './AttendanceTable';

//Cấu hình 3 loại điểm danh cho 3 nút Radio Button
const attendance_types = [
	{ label: 'Có mặt', value: 1 },
	{ label: 'Đi trễ', value: 2 },
	{ label: 'Vắng', value: 0 }
];
//mock
import {
	attendanceData,
	singleAttendanceData,
	singleEmptyAttendanceData
} from '../../../mocks/mockAttendance';

const AttendancePanel = () => {
	const navigate = useNavigate();
	//TEST --Begin--
	const location = useLocation();
	let dateFromSession = null;
	if (location.state && location.state.date) {
		dateFromSession = location.state.date;
	} else if (location.search) {
		const params = new URLSearchParams(location.search);
		if (params.get('date')) dateFromSession = params.get('date');
	}
	const [selectedDate, setSelectedDate] = useState(
		dateFromSession ? new Date(dateFromSession) : new Date()
	);
	//TEST --End--

	// Ngày đang chọn trong Calendar
	// const [selectedDate, setSelectedDate] = useState(new Date());
	// Ca học tương ứng của ngày đó
	const [selectedShift, setSelectedShift] = useState('');

	// State cho bảng điểm danh
	const [attendanceData, setAttendanceData] = useState([]);
	useEffect(() => {
		// Mock-up data. Đúng ra là call API để lấy bảng điểm danh của ngày selectedDate
		// Mock-up demo: Nếu là ngày trong quá khứ thì đã có dữ liệu điểm danh, ngược lại thì chưa có
		let today = new Date();
		if (selectedDate < today) {
			setAttendanceData(singleAttendanceData);
		} else {
			setAttendanceData(singleEmptyAttendanceData);
		}
	}, [selectedDate]);

	// Hàm cập nhật trạng thái điểm danh của học viên
	const handleAttendanceChange = (studentId, value) => {
		setAttendanceData(prev =>
			prev.map(item =>
				item.id == studentId ? { ...item, attendance: value } : item
			)
		);
	};

	// Hàm lưu điểm danh lên server
	const handleSaveAttendance = () => {
		// Mock-up demo: Đúng ra phải submit lên server
		console.log(attendanceData);
	};

	// Header của Card
	const header = () => (
		<div className='flex align-items-center justify-content-between'>
			<span className='text-2xl font-bold'>Bảng điểm danh</span>
			<div className='flex gap-2'>
				<Button
					label='Bảng tổng hợp'
					className='p-button-outlined p-button-info'
					onClick={() => navigate('full')}
				/>
				<Button
					label='QR Code'
					className='p-button-outlined p-button-success'
				/>
			</div>
		</div>
	);

	//renderFooter hiển thị tổng số lượng chuyên cần:
	const renderFooter = typeValue => {
		const total = 0;
		return <span>{total}</span>;
	};

	return (
		<>
			<div className='grid mt-2'>

				<Card title={header()}>
					<div className='formgrid grid'>
						<div className='field col'>
							<label htmlFor='session'>Buổi học</label>
							<Calendar
								id='session'
								value={selectedDate}
								dateFormat='dd/mm/yy'
								showIcon
								showButtonBar
								onChange={e => setSelectedDate(e.value)}
							/>
						</div>
						<div className='field col'>
							<label htmlFor='session'>Ca học</label>
							<InputText value={selectedShift} readOnly />
						</div>
					</div>
					<AttendanceTable
						attendanceList={attendanceData}
						attendance_types={attendance_types}
						handleAttendanceChange={handleAttendanceChange}
						// handleReasonChange={handleReasonChange}
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
							// onClick={handleRefresh}
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

		</>
	);
};

export default AttendancePanel;
