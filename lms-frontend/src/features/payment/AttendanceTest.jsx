import React, { useState } from "react";
import axiosClient from "@/shared/api/axiosClient.js";
import urls from "@/shared/constants/urls.js";

export default function AttendanceTest() {
    const [courseId, setCourseId] = useState("");
    const [date, setDate] = useState(""); // yyyy-MM-dd
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load sessions trong ngày
    const loadSessions = async () => {
        if (!courseId || !date) {
            alert("Nhập Course ID và Date");
            return;
        }
        try {
            setLoading(true);
            const res = await axiosClient.get(urls.getSessionsByDate, {
                params: { courseId, date },
            });
            setSessions(res.data.result || []);
            setSelectedSession(null);
            setStudents([]);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Load sessions failed");
        } finally {
            setLoading(false);
        }
    };

    // Load attendance của session đã chọn
    const loadAttendance = async (sessionId) => {
        try {
            setLoading(true);
            const res = await axiosClient.get(
                urls.getAttendanceBySession(sessionId)
            );
            setStudents(res.data.result || []);
            setSelectedSession(sessionId);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Load attendance failed");
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật trạng thái điểm danh
    const handleAttendanceChange = (index, value) => {
        const copy = [...students];
        copy[index].attendance = value;
        setStudents(copy);
    };

    // Cập nhật note
    const handleNoteChange = (index, value) => {
        const copy = [...students];
        copy[index].note = value;
        setStudents(copy);
    };

    // Lưu điểm danh
    const saveAttendance = async () => {
        if (!selectedSession) {
            alert("Chưa chọn session");
            return;
        }
        try {
            setLoading(true);
            await axiosClient.post(urls.markAttendance, {
                sessionId: selectedSession,
                students: students.map((s) => ({
                    id: s.id,
                    attendance: s.attendance ?? null,
                    note: s.note || null,
                })),
            });
            alert("Điểm danh thành công");
            await loadAttendance(selectedSession);
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
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="VD: 1"
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <label>Date:&nbsp;</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <button disabled={loading} onClick={loadSessions}>
                {loading ? "Đang tải..." : "Load Sessions"}
            </button>

            {sessions.length > 0 && (
                <div style={{ marginTop: 20 }}>
                    <h3>Danh sách sessions</h3>
                    <ul>
                        {sessions.map((s) => (
                            <li key={s.id}>
                                <button onClick={() => loadAttendance(s.id)}>
                                    {s.description} | {s.starttime}-{s.endtime} | {s.room}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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
                                <td>
                                    {s.firstname} {s.lastname}
                                </td>
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
                                        onChange={(e) =>
                                            handleNoteChange(idx, e.target.value)
                                        }
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
