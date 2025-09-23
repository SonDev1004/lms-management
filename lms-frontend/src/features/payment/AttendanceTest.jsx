import React, { useState } from "react";
import axiosClient from "@/shared/api/axiosClient.js";
import urls from "@/shared/constants/urls.js";

export default function AttendanceTest() {
    const [courseId, setCourseId] = useState("");
    const [date, setDate] = useState(""); // yyyy-MM-dd hoặc để trống => hôm nay
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load danh sách học viên điểm danh
    const loadAttendance = async () => {
        if (!courseId) {
            alert("Vui lòng nhập Course ID");
            return;
        }
        try {
            setLoading(true);
            const params = { courseId: courseId.trim() };
            if (date) params.date = date; // BE chấp nhận yyyy-MM-dd hoặc bỏ trống
            const res = await axiosClient.get(urls.GetAttendance, { params });
            setStudents(res.data.result || []);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Load attendance failed");
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật trạng thái điểm danh của 1 học viên
    const handleAttendanceChange = (index, value) => {
        const copy = [...students];
        copy[index].attendance = value;
        setStudents(copy);
    };

    // Cập nhật ghi chú
    const handleNoteChange = (index, value) => {
        const copy = [...students];
        copy[index].note = value;
        setStudents(copy);
    };

    // Lưu điểm danh
    const saveAttendance = async () => {
        if (!courseId) {
            alert("Vui lòng nhập Course ID");
            return;
        }
        try {
            setLoading(true);
            await axiosClient.post(urls.attendance, {
                courseId: Number(courseId),
                date: date || new Date().toISOString().split("T")[0], // yyyy-MM-dd
                students: students.map(s => ({
                    id: s.id,
                    code: s.code,
                    firstname: s.firstname,
                    lastname: s.lastname,
                    gender: s.gender,
                    dateofbirth: s.dateofbirth,
                    avatar: s.avatar,
                    attendance: s.attendance ?? null,
                    note: s.note || null
                }))
            });
            alert("Điểm danh thành công");
            // Reload để cập nhật giao diện mới nhất
            await loadAttendance();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Save attendance failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h2>Attendance Test Page</h2>

            <div style={{ marginBottom: 12 }}>
                <label>Course ID:&nbsp;</label>
                <input
                    value={courseId}
                    onChange={e => setCourseId(e.target.value)}
                    placeholder="VD: 1"
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Date (yyyy-MM-dd, optional):&nbsp;</label>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
            </div>

            <button disabled={loading} onClick={loadAttendance}>
                {loading ? "Đang tải..." : "Load Attendance"}
            </button>

            {students.length > 0 && (
                <>
                    <h3 style={{ marginTop: 20 }}>Danh sách học viên</h3>
                    <table
                        border="1"
                        cellPadding="6"
                        style={{ borderCollapse: "collapse", width: "100%" }}
                    >
                        <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Có mặt</th>
                            <th>Đi trễ</th>
                            <th>Vắng</th>
                            <th>Ghi chú</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((s, idx) => (
                            <tr key={s.id}>
                                <td>{s.firstname} {s.lastname}</td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="radio"
                                        name={`att-${idx}`}
                                        checked={s.attendance === 1}
                                        onChange={() => handleAttendanceChange(idx, 1)}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="radio"
                                        name={`att-${idx}`}
                                        checked={s.attendance === 2}
                                        onChange={() => handleAttendanceChange(idx, 2)}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="radio"
                                        name={`att-${idx}`}
                                        checked={s.attendance === 0}
                                        onChange={() => handleAttendanceChange(idx, 0)}
                                    />
                                </td>
                                <td>
                                    <input
                                        style={{ width: "90%" }}
                                        value={s.note || ""}
                                        onChange={e => handleNoteChange(idx, e.target.value)}
                                        placeholder="Ghi chú"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button
                        style={{ marginTop: 20 }}
                        disabled={loading}
                        onClick={saveAttendance}
                    >
                        {loading ? "Đang lưu..." : "Save Attendance"}
                    </button>
                </>
            )}
        </div>
    );
}
