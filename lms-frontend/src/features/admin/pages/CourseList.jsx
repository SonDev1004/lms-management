import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";

import {
    fetchAllCourses,
    fetchSessionsByCourse,
    generateSessionsForCourse,
    publishCourse,
    replaceTimeslots,
    addStudentToCourse,
    searchPrograms,
    searchTeachers,
    createCoursesByProgram,
    fetchSubjectsByProgram,
    assignTeacher,
    fetchRoomOptions,
    fetchTimeslotsByCourse,
} from "@/features/admin/api/adminCourseApi.js";

export default function CourseList() {
    const toast = useRef(null);

    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [existingTimeslots, setExistingTimeslots] = useState([]);

    // filters
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);

    const statusOptions = [
        { label: "DRAFT", value: "DRAFT" },
        { label: "SCHEDULED", value: "SCHEDULED" },
        { label: "ENROLLING", value: "ENROLLING" },
        { label: "WAITLIST", value: "WAITLIST" },
        { label: "IN_PROGRESS", value: "IN_PROGRESS" },
        { label: "COMPLETED", value: "COMPLETED" },
        { label: "ENDED", value: "ENDED" },
    ];

    const [roomOptions, setRoomOptions] = useState([]);

    // ===== Sessions dialog =====
    const [sessionsDialogVisible, setSessionsDialogVisible] = useState(false);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // ===== Generate sessions dialog =====
    const [genVisible, setGenVisible] = useState(false);
    const [genLoading, setGenLoading] = useState(false);
    const [genForm, setGenForm] = useState({
        startDate: null, // optional
        totalSessions: null, // optional override
    });

    // ===== Add Student dialog =====
    const [addStudentVisible, setAddStudentVisible] = useState(false);
    const [studentIdInput, setStudentIdInput] = useState("");
    const [addStudentLoading, setAddStudentLoading] = useState(false);

    // ===== Timeslot dialog =====
    const [timeslotVisible, setTimeslotVisible] = useState(false);
    const [timeslots, setTimeslots] = useState([]);
    const [timeslotSaving, setTimeslotSaving] = useState(false);

    // ===== Assign teacher dialog =====
    const [assignVisible, setAssignVisible] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [teacherSearch, setTeacherSearch] = useState("");
    const [assignTeacherId, setAssignTeacherId] = useState(null);

    // ===== Create group (courses by program) dialog =====
    const [createVisible, setCreateVisible] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [programOptions, setProgramOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [createForm, setCreateForm] = useState({
        programId: null,
        subjectIds: [],
        baseTitle: "",
        capacity: 20,
        trackCode: "",
        firstWeekStart: null,
        staffId: 1,
    });

    // ===== preset schedule templates =====
    const scheduleTemplates = [
        {
            label: "Mon/Wed/Fri 18:00–19:30",
            value: "MWF_EVE",
            items: [
                { dayOfWeek: 1, startTime: "18:00", endTime: "19:30", roomId: "" },
                { dayOfWeek: 3, startTime: "18:00", endTime: "19:30", roomId: "" },
                { dayOfWeek: 5, startTime: "18:00", endTime: "19:30", roomId: "" },
            ],
        },
        {
            label: "Tue/Thu/Sat 18:00–19:30",
            value: "TTS_EVE",
            items: [
                { dayOfWeek: 2, startTime: "18:00", endTime: "19:30", roomId: "" },
                { dayOfWeek: 4, startTime: "18:00", endTime: "19:30", roomId: "" },
                { dayOfWeek: 6, startTime: "18:00", endTime: "19:30", roomId: "" },
            ],
        },
        {
            label: "Weekend 09:00–11:30 (Sat/Sun)",
            value: "WE_MORN",
            items: [
                { dayOfWeek: 6, startTime: "09:00", endTime: "11:30", roomId: "" },
                { dayOfWeek: 7, startTime: "09:00", endTime: "11:30", roomId: "" },
            ],
        },
        {
            label: "Mon–Fri 14:00–17:00",
            value: "WK_PM",
            items: [
                { dayOfWeek: 1, startTime: "14:00", endTime: "17:00", roomId: "" },
                { dayOfWeek: 2, startTime: "14:00", endTime: "17:00", roomId: "" },
                { dayOfWeek: 3, startTime: "14:00", endTime: "17:00", roomId: "" },
                { dayOfWeek: 4, startTime: "14:00", endTime: "17:00", roomId: "" },
                { dayOfWeek: 5, startTime: "14:00", endTime: "17:00", roomId: "" },
            ],
        },
    ];
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const dayOptions = [
        { label: "Mon", value: 1 },
        { label: "Tue", value: 2 },
        { label: "Wed", value: 3 },
        { label: "Thu", value: 4 },
        { label: "Fri", value: 5 },
        { label: "Sat", value: 6 },
        { label: "Sun", value: 7 },
    ];

    useEffect(() => {
        loadCourses();
    }, []);

    async function loadCourses() {
        try {
            setLoading(true);
            const data = await fetchAllCourses();
            setCourses(data || []);
        } catch (err) {
            console.error("Load courses failed:", err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không tải được danh sách lớp",
            });
        } finally {
            setLoading(false);
        }
    }

    const filteredCourses = useMemo(() => {
        const keyword = (searchText || "").toLowerCase();

        return (courses || []).filter((c) => {
            if (statusFilter && c.status !== statusFilter) return false;
            if (!keyword) return true;

            const haystack = [c.title, c.teacherName, c.programName, c.subjectName, c.code]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(keyword);
        });
    }, [courses, searchText, statusFilter]);

    const statusTemplate = (row) => {
        const severity =
            {
                DRAFT: "secondary",
                SCHEDULED: "info",
                ENROLLING: "success",
                WAITLIST: "warning",
                IN_PROGRESS: "primary",
                COMPLETED: "success",
                ENDED: "danger",
            }[row.status] || "secondary";

        return <Tag value={row.status} severity={severity} rounded />;
    };

    const teacherTemplate = (row) => {
        if (row.teacherName) return row.teacherName;
        return <Tag value="Chưa gán" severity="warning" rounded />;
    };

    const sessionStatusTemplate = (row) => {
        switch (row.status) {
            case 0:
                return <Tag value="SCHEDULED" severity="info" rounded />;
            case 1:
                return <Tag value="COMPLETED" severity="success" rounded />;
            case 5:
                return <Tag value="CANCELLED" severity="danger" rounded />;
            default:
                return row.status;
        }
    };

    // ===== Sessions =====
    async function handleViewSessions(course) {
        setSelectedCourse(course);
        setSessionsDialogVisible(true);
        setSessions([]);
        try {
            setSessionsLoading(true);
            const data = await fetchSessionsByCourse(course.courseId);

            const mapped = (Array.isArray(data) ? data : []).map((s) => ({
                ...s,
                orderSession: s.order,
                startTime: s.starttime,
                endTime: s.endtime,
                roomName: s.room,
            }));

            setSessions(mapped);
        } catch (err) {
            console.error("Load sessions failed:", err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không tải được danh sách buổi học",
            });
        } finally {
            setSessionsLoading(false);
        }
    }

    // ===== Generate sessions (NEW: dialog + totalSessions) =====
    function openGenerateDialog(course) {
        setSelectedCourse(course);

        const defaultStart = course?.startDate ? new Date(course.startDate) : null;

        setGenForm({
            startDate: defaultStart,
            totalSessions:
                course?.plannedSession ??
                course?.sessions ??
                null,
        });

        setGenVisible(true);
    }

    async function handleConfirmGenerate() {
        if (!selectedCourse) return;

        const ok = window.confirm(
            `Tạo lại toàn bộ buổi học cho lớp "${selectedCourse.title}"?\nCác buổi cũ (nếu có) sẽ bị xoá.`
        );
        if (!ok) return;

        try {
            setGenLoading(true);

            const payload = {};

            if (genForm.startDate) {
                payload.startDate = genForm.startDate.toISOString().substring(0, 10);
            }

            const n = Number(genForm.totalSessions);
            if (!Number.isNaN(n) && n > 0) {
                payload.totalSessions = n;
            }

            await generateSessionsForCourse(selectedCourse.courseId, payload);

            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã tạo buổi học theo lịch",
            });

            setGenVisible(false);
            await loadCourses();
        } catch (err) {
            console.error("Generate sessions failed:", err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: err?.response?.data?.message || "Tạo buổi học thất bại",
            });
        } finally {
            setGenLoading(false);
        }
    }

    async function handlePublish(course) {
        const ok = window.confirm(`Publish lớp "${course.title}"?`);
        if (!ok) return;

        try {
            await publishCourse(course.courseId);
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã publish lớp",
            });
            await loadCourses();
        } catch (err) {
            console.error("Publish course failed:", err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: err?.response?.data?.message || "Publish thất bại",
            });
        }
    }

    // ===== Timeslots =====
    async function openTimeslotDialog(course) {
        setSelectedCourse(course);
        setSelectedTemplate(null);
        setExistingTimeslots([]);
        setTimeslotVisible(true);

        try {
            const [rooms, existed] = await Promise.all([
                fetchRoomOptions(),
                fetchTimeslotsByCourse(course.courseId),
            ]);

            setRoomOptions([{ value: null, label: "Không gán phòng" }, ...(rooms || [])]);

            const normalized = (existed || []).map((t) => ({
                id: t.id,
                dayOfWeek: t.dayOfWeek,
                startTime: String(t.startTime).slice(0, 5),
                endTime: String(t.endTime).slice(0, 5),
                roomId: t.roomId ?? null,
                roomName: t.roomName ?? "",
                isActive: t.isActive ?? true,
            }));

            setExistingTimeslots(normalized);

            setTimeslots(
                normalized.length
                    ? normalized.map(({ dayOfWeek, startTime, endTime, roomId }) => ({
                        dayOfWeek,
                        startTime,
                        endTime,
                        roomId,
                    }))
                    : [{ dayOfWeek: 1, startTime: "18:00", endTime: "19:30", roomId: null }]
            );
        } catch (e) {
            console.error("Open timeslot dialog failed", e);
            setRoomOptions([{ value: null, label: "Không gán phòng" }]);
            setTimeslots([{ dayOfWeek: 1, startTime: "18:00", endTime: "19:30", roomId: null }]);
        }
    }

    function applyTemplate(templateValue) {
        setSelectedTemplate(templateValue);
        const tpl = scheduleTemplates.find((x) => x.value === templateValue);
        if (!tpl) return;
        setTimeslots(tpl.items.map((x) => ({ ...x })));
    }

    function handleChangeTimeslot(index, field, value) {
        setTimeslots((prev) => {
            const clone = [...prev];
            clone[index] = { ...clone[index], [field]: value };
            return clone;
        });
    }

    function handleAddTimeslotRow() {
        setTimeslots((prev) => [
            ...prev,
            { dayOfWeek: 1, startTime: "18:00", endTime: "19:30", roomId: "" },
        ]);
    }

    function handleRemoveTimeslotRow(idx) {
        setTimeslots((prev) => prev.filter((_, i) => i !== idx));
    }

    async function handleSaveTimeslots() {
        if (!selectedCourse) return;

        try {
            setTimeslotSaving(true);

            const payload = timeslots
                .filter((t) => t.dayOfWeek && t.startTime && t.endTime)
                .map((t) => ({
                    dayOfWeek: Number(t.dayOfWeek),
                    startTime: String(t.startTime).trim(),
                    endTime: String(t.endTime).trim(),
                    roomId: t.roomId ? Number(t.roomId) : null,
                }));

            if (!payload.length) {
                toast.current?.show({
                    severity: "warn",
                    summary: "Thiếu dữ liệu",
                    detail: "Cần ít nhất 1 lịch học hợp lệ",
                });
                return;
            }

            await replaceTimeslots(selectedCourse.courseId, payload);
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã cập nhật lịch học",
            });
            setTimeslotVisible(false);
        } catch (err) {
            console.error("Save timeslots failed:", err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: err?.response?.data?.message || "Cập nhật lịch học thất bại",
            });
        } finally {
            setTimeslotSaving(false);
        }
    }

    // ===== Add student =====
    function openAddStudentDialog(course) {
        setSelectedCourse(course);
        setStudentIdInput("");
        setAddStudentVisible(true);
    }

    async function handleSubmitAddStudent() {
        if (!selectedCourse) return;
        if (!studentIdInput) {
            toast.current?.show({
                severity: "warn",
                summary: "Thiếu dữ liệu",
                detail: "Vui lòng nhập studentId",
            });
            return;
        }

        try {
            setAddStudentLoading(true);
            await addStudentToCourse(selectedCourse.courseId, {
                studentId: Number(studentIdInput),
                source: "MANUAL",
            });
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã thêm học viên vào lớp",
            });
            setAddStudentVisible(false);
            await loadCourses();
        } catch (err) {
            console.error("Add student failed:", err);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: err?.response?.data?.message || "Thêm học viên thất bại",
            });
        } finally {
            setAddStudentLoading(false);
        }
    }

    // ===== Assign teacher =====
    async function openAssignTeacherDialog(course) {
        setSelectedCourse(course);
        setAssignTeacherId(null);
        setTeacherSearch("");
        setAssignVisible(true);

        try {
            const teachers = await searchTeachers("");
            setTeacherOptions(teachers || []);
        } catch (e) {
            console.error("Load teacher options failed", e);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không tải được danh sách giáo viên",
            });
        }
    }

    async function handleSearchTeacher() {
        try {
            const teachers = await searchTeachers(teacherSearch || "");
            setTeacherOptions(teachers || []);
        } catch (e) {
            console.error("Search teacher failed", e);
        }
    }

    async function handleSaveAssignTeacher() {
        if (!selectedCourse) return;
        if (!assignTeacherId) {
            toast.current?.show({
                severity: "warn",
                summary: "Thiếu dữ liệu",
                detail: "Vui lòng chọn giáo viên",
            });
            return;
        }

        try {
            setAssignLoading(true);
            await assignTeacher(selectedCourse.courseId, assignTeacherId);
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Đã gán giáo viên cho lớp",
            });
            setAssignVisible(false);
            await loadCourses();
        } catch (e) {
            console.error("Assign teacher failed", e);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: e?.response?.data?.message || "Gán giáo viên thất bại",
            });
        } finally {
            setAssignLoading(false);
        }
    }

    // ===== Create courses by program =====
    const updateCreateForm = (patch) => setCreateForm((prev) => ({ ...prev, ...patch }));

    async function openCreateDialog() {
        setCreateForm({
            programId: null,
            subjectIds: [],
            baseTitle: "",
            capacity: 20,
            trackCode: "",
            firstWeekStart: null,
            staffId: 1,
        });
        setSubjectOptions([]);
        setCreateVisible(true);

        try {
            const programs = await searchPrograms("");
            setProgramOptions(programs || []);
        } catch (e) {
            console.error("Load programs failed", e);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Không tải được danh sách chương trình",
            });
        }
    }

    async function handleChangeProgram(programId) {
        updateCreateForm({ programId, subjectIds: [] });
        setSubjectOptions([]);

        if (!programId) return;

        try {
            const subjects = await fetchSubjectsByProgram(programId);
            const sorted = [...(subjects || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
            setSubjectOptions(sorted);

            updateCreateForm({ subjectIds: sorted.map((x) => x.value) });
        } catch (e) {
            console.error("Fetch subjects by program failed", e);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: e?.response?.data?.message || "Không lấy được danh sách môn theo chương trình",
            });
        }
    }

    async function handleSubmitCreate() {
        const { programId, subjectIds, baseTitle, capacity, trackCode, firstWeekStart, staffId } = createForm;

        if (!programId || !firstWeekStart || !baseTitle?.trim()) {
            toast.current?.show({
                severity: "warn",
                summary: "Thiếu dữ liệu",
                detail: "Vui lòng chọn Program, nhập Course title và Start date",
            });
            return;
        }

        if (!subjectIds || !subjectIds.length) {
            toast.current?.show({
                severity: "warn",
                summary: "Thiếu môn học",
                detail: "Chương trình chưa có curriculum môn học hoặc bạn chưa chọn môn nào",
            });
            return;
        }

        try {
            setCreateLoading(true);

            const payload = {
                programId,
                subjectIds,
                baseTitle: baseTitle.trim(),
                capacity: Number(capacity),
                trackCode: trackCode?.trim() ? trackCode.trim() : null,
                firstWeekStart: firstWeekStart.toISOString().substring(0, 10),
                staffId: Number(staffId || 1),
            };

            const res = await createCoursesByProgram(payload);

            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail:
                    `Đã tạo ${subjectIds.length} lớp theo curriculum` +
                    (res?.trackCode ? ` (Track: ${res.trackCode})` : ""),
            });

            setCreateVisible(false);
            await loadCourses();
        } catch (e) {
            console.error("Create courses by program failed", e);
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: e?.response?.data?.message || "Tạo lớp thất bại",
            });
        } finally {
            setCreateLoading(false);
        }
    }

    const actionTemplate = (row) => (
        <div className="flex gap-2 flex-wrap">
            <Button
                label="Teacher"
                icon="pi pi-user"
                className="p-button-outlined p-button-sm"
                onClick={() => openAssignTeacherDialog(row)}
            />
            <Button
                label="Sessions"
                icon="pi pi-calendar"
                className="p-button-sm"
                onClick={() => handleViewSessions(row)}
            />
            <Button
                label="Timeslot"
                icon="pi pi-clock"
                className="p-button-sm"
                onClick={() => openTimeslotDialog(row)}
            />
            <Button
                label="Generate"
                icon="pi pi-sync"
                className="p-button-sm"
                onClick={() => openGenerateDialog(row)}
            />
            <Button
                label="Publish"
                icon="pi pi-upload"
                className="p-button-sm p-button-success"
                onClick={() => handlePublish(row)}
            />
            <Button
                label="Add"
                icon="pi pi-user-plus"
                className="p-button-sm p-button-secondary"
                onClick={() => openAddStudentDialog(row)}
            />
        </div>
    );

    return (
        <div className="p-4">
            <Toast ref={toast} />

            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                <div>
                    <div className="text-2xl font-bold">Course Management</div>
                    <div className="text-sm text-gray-500">
                        Tạo lớp theo chương trình (Program). Mỗi môn (Subject) trong curriculum sẽ tạo ra 1 lớp (Course).
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search course / teacher / program..."
                            style={{ minWidth: "220px" }}
                        />
                    </span>

                    <Dropdown
                        value={statusFilter}
                        options={statusOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Filter status"
                        className="w-40"
                        onChange={(e) => setStatusFilter(e.value)}
                        showClear
                        appendTo={document.body}
                    />

                    <Button label="Create" icon="pi pi-plus" onClick={openCreateDialog} />
                </div>
            </div>

            <DataTable
                value={filteredCourses}
                loading={loading}
                paginator
                rows={10}
                className="p-datatable-sm"
                emptyMessage="No courses found"
                responsiveLayout="scroll"
            >
                <Column field="title" header="Course" sortable />
                <Column header="Teacher" body={teacherTemplate} sortable />
                <Column field="programName" header="Program" sortable />
                <Column field="subjectName" header="Subject" sortable />
                <Column header="Students" body={(row) => `${row.students}/${row.capacity}`} sortable />
                <Column field="sessions" header="Sessions" sortable />
                <Column field="startDate" header="Start" sortable />
                <Column field="status" header="Status" body={statusTemplate} sortable />
                <Column header="Actions" body={actionTemplate} />
            </DataTable>

            {/* ===== Sessions Dialog ===== */}
            <Dialog
                header={selectedCourse ? `Sessions – ${selectedCourse.title}` : "Sessions"}
                visible={sessionsDialogVisible}
                style={{ width: "60vw", maxWidth: "95vw" }}
                modal
                onHide={() => setSessionsDialogVisible(false)}
            >
                <DataTable value={sessions} loading={sessionsLoading} paginator rows={10} emptyMessage="No sessions">
                    <Column field="orderSession" header="#" />
                    <Column field="date" header="Date" />
                    <Column field="startTime" header="Start" />
                    <Column field="endTime" header="End" />
                    <Column field="roomName" header="Room" />
                    <Column field="status" header="Status" body={sessionStatusTemplate} />
                </DataTable>
            </Dialog>

            {/* ===== Generate Sessions Dialog (NEW) ===== */}
            <Dialog
                header={selectedCourse ? `Generate Sessions – ${selectedCourse.title}` : "Generate Sessions"}
                visible={genVisible}
                style={{ width: "520px", maxWidth: "95vw" }}
                modal
                onHide={() => setGenVisible(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            label="Cancel"
                            className="p-button-text"
                            onClick={() => setGenVisible(false)}
                            disabled={genLoading}
                        />
                        <Button
                            label="Generate"
                            icon="pi pi-sync"
                            loading={genLoading}
                            onClick={handleConfirmGenerate}
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-3">
                    <div className="text-sm text-gray-500">
                        Bạn có thể override số buổi (tuỳ chọn). Nếu để trống, BE sẽ dùng plannedSession/subject.sessionNumber.
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Start date (tuỳ chọn)</label>
                        <Calendar
                            value={genForm.startDate}
                            onChange={(e) => setGenForm((p) => ({ ...p, startDate: e.value }))}
                            dateFormat="yy-mm-dd"
                            showIcon
                            className="w-full"
                            appendTo={document.body}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Total sessions (tuỳ chọn)</label>
                        <InputText
                            value={genForm.totalSessions ?? ""}
                            onChange={(e) => {
                                const raw = e.target.value;
                                setGenForm((p) => ({ ...p, totalSessions: raw === "" ? null : raw }));
                            }}
                            placeholder="VD: 20"
                            className="w-full"
                            keyfilter="int"
                        />
                    </div>
                </div>
            </Dialog>

            {/* ===== Timeslot Dialog ===== */}
            <Dialog
                header={selectedCourse ? `Timeslot – ${selectedCourse.title}` : "Timeslot"}
                visible={timeslotVisible}
                style={{ width: "760px", maxWidth: "95vw" }}
                modal
                onHide={() => setTimeslotVisible(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" className="p-button-text" onClick={() => setTimeslotVisible(false)} />
                        <Button label="Save" icon="pi pi-check" loading={timeslotSaving} onClick={handleSaveTimeslots} />
                    </div>
                }
            >
                <div className="mb-3 text-sm text-gray-500">
                    Chọn lịch mẫu hoặc nhập lịch học theo tuần. Định dạng thời gian <code>HH:mm</code>. Room ID có thể để trống.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Lịch mẫu</label>
                        <Dropdown
                            value={selectedTemplate}
                            options={scheduleTemplates}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Chọn lịch mẫu (tuỳ chọn)"
                            className="w-full"
                            onChange={(e) => applyTemplate(e.value)}
                            showClear
                            appendTo={document.body}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            label="Add timeslot"
                            icon="pi pi-plus"
                            className="w-full"
                            onClick={handleAddTimeslotRow}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {timeslots.map((slot, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-3">
                                <Dropdown
                                    value={slot.dayOfWeek}
                                    options={dayOptions}
                                    onChange={(e) => handleChangeTimeslot(idx, "dayOfWeek", e.value)}
                                    placeholder="Day"
                                    className="w-full"
                                    appendTo={document.body}
                                />
                            </div>
                            <div className="col-span-3">
                                <InputText
                                    value={slot.startTime}
                                    onChange={(e) => handleChangeTimeslot(idx, "startTime", e.target.value)}
                                    placeholder="Start (18:00)"
                                    className="w-full"
                                />
                            </div>
                            <div className="col-span-3">
                                <InputText
                                    value={slot.endTime}
                                    onChange={(e) => handleChangeTimeslot(idx, "endTime", e.target.value)}
                                    placeholder="End (19:30)"
                                    className="w-full"
                                />
                            </div>
                            <div className="col-span-2">
                                <Dropdown
                                    value={slot.roomId ?? null}
                                    options={roomOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Room"
                                    className="w-full"
                                    onChange={(e) => handleChangeTimeslot(idx, "roomId", e.value)}
                                    showClear
                                    appendTo={document.body}
                                />
                            </div>

                            <div className="col-span-1 flex justify-end">
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-text p-button-danger p-button-sm"
                                    onClick={() => handleRemoveTimeslotRow(idx)}
                                />
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-medium mb-2">Timeslot hiện tại</div>
                                <DataTable value={existingTimeslots} emptyMessage="Chưa có timeslot" className="p-datatable-sm">
                                    <Column field="dayOfWeek" header="Day" />
                                    <Column header="Time" body={(r) => `${r.startTime}–${r.endTime}`} />
                                    <Column header="Room" body={(r) => r.roomName || "Không gán phòng"} />
                                    <Column header="Active" body={(r) => (r.isActive ? "Yes" : "No")} />
                                </DataTable>
                            </div>
                        </div>
                    ))}
                </div>
            </Dialog>

            {/* ===== Add Student Dialog ===== */}
            <Dialog
                header={selectedCourse ? `Add student – ${selectedCourse.title}` : "Add student"}
                visible={addStudentVisible}
                style={{ width: "420px", maxWidth: "95vw" }}
                modal
                onHide={() => setAddStudentVisible(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" className="p-button-text" onClick={() => setAddStudentVisible(false)} />
                        <Button label="Add" icon="pi pi-user-plus" loading={addStudentLoading} onClick={handleSubmitAddStudent} />
                    </div>
                }
            >
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Student ID</label>
                    <InputText value={studentIdInput} onChange={(e) => setStudentIdInput(e.target.value)} placeholder="VD: 15" />
                </div>
            </Dialog>

            {/* ===== Assign Teacher Dialog ===== */}
            <Dialog
                header={selectedCourse ? `Assign teacher – ${selectedCourse.title}` : "Assign teacher"}
                visible={assignVisible}
                style={{ width: "760px", maxWidth: "95vw" }}
                modal
                onHide={() => setAssignVisible(false)}
                footer={
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                        <div className="text-sm text-gray-500">
                            Gợi ý: hãy gán giáo viên trước, sau đó mới tạo lịch (Timeslot) và Generate buổi học.
                        </div>
                        <div className="flex gap-2">
                            <Button label="Cancel" className="p-button-text" onClick={() => setAssignVisible(false)} />
                            <Button label="Save" icon="pi pi-check" loading={assignLoading} onClick={handleSaveAssignTeacher} />
                        </div>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Search teacher</label>
                        <div className="flex gap-2">
                            <InputText
                                value={teacherSearch}
                                onChange={(e) => setTeacherSearch(e.target.value)}
                                placeholder="Nhập tên / email..."
                                className="w-full"
                            />
                            <Button label="Search" icon="pi pi-search" onClick={handleSearchTeacher} />
                            <Button
                                label="Reset"
                                className="p-button-outlined"
                                onClick={async () => {
                                    setTeacherSearch("");
                                    const teachers = await searchTeachers("");
                                    setTeacherOptions(teachers || []);
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Teacher</label>
                        <Dropdown
                            value={assignTeacherId}
                            options={teacherOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Chọn giáo viên"
                            className="w-full"
                            onChange={(e) => setAssignTeacherId(e.value)}
                            filter
                            showClear
                            appendTo={document.body}
                        />
                    </div>
                </div>
            </Dialog>

            {/* ===== Create Courses Dialog ===== */}
            <Dialog
                header="Create Course"
                visible={createVisible}
                style={{ width: "860px", maxWidth: "95vw" }}
                modal
                onHide={() => setCreateVisible(false)}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button label="Cancel" className="p-button-text" onClick={() => setCreateVisible(false)} />
                        <Button label="Create" icon="pi pi-check" loading={createLoading} onClick={handleSubmitCreate} />
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Program</label>
                        <Dropdown
                            value={createForm.programId}
                            options={programOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Chọn chương trình"
                            className="w-full"
                            onChange={(e) => handleChangeProgram(e.value)}
                            filter
                            showClear
                            appendTo={document.body}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">First week start (ngày khai giảng)</label>
                        <Calendar
                            value={createForm.firstWeekStart}
                            onChange={(e) => updateCreateForm({ firstWeekStart: e.value })}
                            dateFormat="yy-mm-dd"
                            showIcon
                            className="w-full"
                            appendTo={document.body}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Curriculum / Subjects</label>
                        <MultiSelect
                            value={createForm.subjectIds}
                            options={subjectOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder={createForm.programId ? "Chọn môn (mặc định chọn tất cả)" : "Chọn Program trước"}
                            className="w-full"
                            onChange={(e) => updateCreateForm({ subjectIds: e.value })}
                            display="chip"
                            disabled={!createForm.programId}
                            appendTo={document.body}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Mỗi môn bạn chọn sẽ tạo ra 1 lớp riêng. Học viên đăng ký theo Track/Lịch sẽ được gán vào các lớp tương ứng.
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Course title (base)</label>
                        <InputText
                            value={createForm.baseTitle}
                            onChange={(e) => updateCreateForm({ baseTitle: e.target.value })}
                            className="w-full"
                            placeholder="VD: English Preschool For Kid"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Capacity</label>
                        <InputText
                            value={createForm.capacity}
                            onChange={(e) => updateCreateForm({ capacity: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-1 block">Track code (optional)</label>
                        <InputText
                            value={createForm.trackCode}
                            onChange={(e) => updateCreateForm({ trackCode: e.target.value })}
                            className="w-full"
                            placeholder="Để trống nếu muốn hệ thống tự tạo"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            Nếu để trống, hệ thống sẽ tự tạo Track code theo chương trình và năm học.
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
