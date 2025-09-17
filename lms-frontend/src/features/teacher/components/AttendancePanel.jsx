//use and React:
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "primereact";

//component
import SessionSelect from "../../session/components/SessionSelect.jsx";
import AttendanceTable from "./AttendanceTable";

//Cấu hình 3 loại điểm danh cho 3 nút Radio Button
const attendance_types = [
    { label: "Vắng", value: "Absent" },
    { label: "Đi trễ", value: "Late" },
    { label: "Có mặt", value: "Present" }
];
//mock
import { attendanceData } from '../../../mocks/mockAttendance';

const AttendancePanel = () => {
    const navigate = useNavigate();
    // const { courseId } = useParams();
    const today = new Date().toISOString().slice(0, 10);

    //Lọc ra session hnay:
    const sessionsToday = attendanceData.sessions.filter(session => session.date === today);
    const [sessionId, setSessionId] = useState(sessionsToday.length === 1 ? sessionsToday[0]?.id : null);

    // State cho bảng điễm danh
    const [attendanceList, setAttendanceList] = useState([]);
    useEffect(() => {
        if (!sessionId) return setAttendanceList([]);
        const updated = attendanceData.students.map(student => {
            const attendance = student.attendancelist.find(a => a.sessionId === sessionId);
            return {
                ...student,
                attendance: attendance?.status || "none",
                reasonAbsent: attendance?.reason || ""
            };
        })
        setAttendanceList(updated);
    }, [sessionId]);
    //Handle
    //Cập nhật trạng thái từng học viên trong state
    const handleAttendanceChange = (studentId, value) => {
        setAttendanceList(prev =>
            prev.map(stu =>
                stu.id === studentId ? { ...stu, attendance: value } : stu));
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
        console.log("Đã lưu:", attendanceList);
        localStorage.setItem('attendanceList', JSON.stringify(attendanceList));
        alert('Lưu thành công');
    }
    //Hàm Refresh lại trang
    const handleRefresh = () => {
        if (!sessionId) return setAttendanceList([]);
        const updated = attendanceData.students.map(student => {
            const attendance = student.attendancelist.find(a => a.sessionId === sessionId);
            return {
                ...student,
                attendance: attendance?.status || "none",
                reasonAbsent: attendance?.reason || ""
            };
        });
        setAttendanceList(updated);
    };

    //Header của Card
    const header = () => (
        <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-bold">Bảng điểm danh</span>
            <div className="flex gap-2">
                <Button label="Bảng tổng hợp" className="p-button-outlined p-button-info" />
                <Button label="QR Code" className="p-button-outlined p-button-success" />
            </div>
        </div>
    );

    //renderFooter hiển thi tổng số lượng chuyên cần:
    const renderFooter = (typeValue) => {
        const total = attendanceList.filter(stu => stu.attendance === typeValue).length;
        return <span>{total}</span>;
    }

    return (<>
        <div className="grid mt-2">
            <div className="col-9">
                <Card title={header()} >
                    <SessionSelect
                        sessions={sessionsToday}
                        sessionId={sessionId}
                        onChange={setSessionId}
                    />
                    {sessionsToday.length === 0 && (
                        <div className="text-red-500 my-3">Không có ca học nào hôm nay.</div>
                    )}
                    <AttendanceTable
                        attendanceList={attendanceList}
                        attendance_types={attendance_types}
                        handleAttendanceChange={handleAttendanceChange}
                        handleReasonChange={handleReasonChange}
                        renderFooter={renderFooter}
                    />
                    <div className="flex justify-content-between flex-wrap mt-4">
                        <div className="flex align-items-center justify-content-center">
                            <Button label="Quay lại" onClick={() => navigate(-1)} />
                            <Button label="Refresh" className="ml-2" onClick={() => handleRefresh()} />
                        </div>
                        <div className="flex align-items-center justify-content-center">
                            <Button label="Lưu" onClick={() => handleSaveAttendance()} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </>);
}

export default AttendancePanel;