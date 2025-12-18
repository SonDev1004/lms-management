import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import "../css/NotificationForm.css";
import {
    sendNotification,
    getNotificationTypes,
    getRoleOptions,
    searchUsers,
    searchCourses,
    searchPrograms,
} from "@/features/notification/api/notificationService";

// Abort helper
function useAbortable() {
    const ctrl = useRef(null);
    return () => {
        if (ctrl.current) ctrl.current.abort();
        ctrl.current = new AbortController();
        return ctrl.current.signal;
    };
}

// Debounce helper
function useDebounced(cb, delay = 300) {
    const t = useRef();
    return (...args) => {
        clearTimeout(t.current);
        t.current = setTimeout(() => cb(...args), delay);
    };
}

export default function NotificationForm() {
    const toast = useRef(null);

    const [form, setForm] = useState({
        title: "",
        content: "",
        severity: 1,
        url: "",
        notificationTypeId: null,
        broadcast: false,

        targetRoles: [],
        targetUsers: [],
        targetCourses: [],
        targetPrograms: [],

        scheduledDate: null,
    });

    // options
    const [typeOptions, setTypeOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);

    // suggestions
    const [userSug, setUserSug] = useState([]);
    const [courseSug, setCourseSug] = useState([]);
    const [programSug, setProgramSug] = useState([]);

    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingCourse, setLoadingCourse] = useState(false);
    const [loadingProgram, setLoadingProgram] = useState(false);

    // lightweight caches for opening dropdown again
    const cacheRef = useRef({ users: null, courses: null, programs: null });

    // abort signals per resource
    const userSignal = useAbortable();
    const courseSignal = useAbortable();
    const programSignal = useAbortable();

    /* ===== Load dropdown options ===== */
    useEffect(() => {
        (async () => {
            try {
                const [types, roles] = await Promise.all([getNotificationTypes(), getRoleOptions()]);
                setTypeOptions(types);
                setRoleOptions(roles);
                if (!form.notificationTypeId && types?.length) {
                    setForm((s) => ({ ...s, notificationTypeId: types[0].value }));
                }
            } catch (e) {
                toast.current?.show({
                    severity: "error",
                    summary: "Không tải được options",
                    detail: e?.detail || e?.message || "Lỗi không xác định",
                });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ===== Fetchers (q="" -> first page) ===== */
    const fetchUsers = async (q = "") => {
        setLoadingUser(true);
        try {
            const res = await searchUsers(q, 1, 50, userSignal());
            if (!q) cacheRef.current.users = res;
            setUserSug(res);
        } finally {
            setLoadingUser(false);
        }
    };
    const fetchCourses = async (q = "") => {
        setLoadingCourse(true);
        try {
            const res = await searchCourses(q, 1, 50, courseSignal());
            if (!q) cacheRef.current.courses = res;
            setCourseSug(res);
        } finally {
            setLoadingCourse(false);
        }
    };
    const fetchPrograms = async (q = "") => {
        setLoadingProgram(true);
        try {
            const res = await searchPrograms(q, 1, 50, programSignal());
            if (!q) cacheRef.current.programs = res;
            setProgramSug(res);
        } finally {
            setLoadingProgram(false);
        }
    };

    // debounced autocomplete handlers
    const onCompleteUsers = useDebounced((e) => fetchUsers(e.query || ""), 250);
    const onCompleteCourses = useDebounced((e) => fetchCourses(e.query || ""), 250);
    const onCompletePrograms = useDebounced((e) => fetchPrograms(e.query || ""), 250);

    // prefetch on open/focus
    const preopenUsers = () => {
        if (cacheRef.current.users) setUserSug(cacheRef.current.users);
        else fetchUsers("");
    };
    const preopenCourses = () => {
        if (cacheRef.current.courses) setCourseSug(cacheRef.current.courses);
        else fetchCourses("");
    };
    const preopenPrograms = () => {
        if (cacheRef.current.programs) setProgramSug(cacheRef.current.programs);
        else fetchPrograms("");
    };

    /* ===== Submit ===== */
    const onSubmit = async () => {
        try {
            if (!form.title.trim()) {
                toast.current?.show({ severity: "warn", summary: "Thiếu Title", detail: "Nhập tiêu đề thông báo." });
                return;
            }
            if (!form.content.trim()) {
                toast.current?.show({ severity: "warn", summary: "Thiếu Content", detail: "Nhập nội dung thông báo." });
                return;
            }
            if (!form.notificationTypeId) {
                toast.current?.show({ severity: "warn", summary: "Thiếu Type", detail: "Chọn loại thông báo." });
                return;
            }
            if (
                !form.broadcast &&
                form.targetRoles.length === 0 &&
                form.targetUsers.length === 0 &&
                form.targetCourses.length === 0 &&
                form.targetPrograms.length === 0
            ) {
                toast.current?.show({
                    severity: "warn",
                    summary: "Chưa có người nhận",
                    detail: "Bật Broadcast hoặc chọn ít nhất một Roles/Users/Courses/Programs.",
                });
                return;
            }
            if (import.meta.env.DEV) console.log("[NOTI] raw form", form);
            await sendNotification(form);

            toast.current?.show({
                severity: "success",
                summary: "Đã gửi",
                detail: "Thông báo đã gửi / hẹn giờ.",
            });

            setForm({
                title: "",
                content: "",
                severity: 1,
                url: "",
                notificationTypeId: typeOptions?.[0]?.value ?? null,
                broadcast: false,
                targetRoles: [],
                targetUsers: [],
                targetCourses: [],
                targetPrograms: [],
                scheduledDate: null,
            });
        } catch (e) {
            const status = e?.status || e?.response?.status;
            const msg =
                e?.detail ||
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                e?.message ||
                "Không thể gửi thông báo";
            toast.current?.show({
                severity: "error",
                summary: `Lỗi${status ? ` ${status}` : ""}`,
                detail: msg,
                life: 6500,
            });
            if (import.meta.env.DEV) console.error(e);
        }
    };


    /* ===== Item templates for suggestions ===== */
    const userItemTpl = (u) => (
        <div className="flex flex-column">
            <span className="font-semibold">{u.name || `User #${u.id}`}</span>
            <small className="text-500">{u.email}</small>
        </div>
    );
    const courseItemTpl = (c) => (
        <div className="flex flex-column">
            <span className="font-semibold">{c.code || `Course #${c.id}`}</span>
            <small className="text-500">{c.title}</small>
        </div>
    );
    const programItemTpl = (p) => (
        <div className="flex flex-column">
            <span className="font-semibold">{p.name || `Program #${p.id}`}</span>
            <small className="text-500">ID: {p.id}</small>
        </div>
    );

    return (
        <div className="nf-root">
            <Toast ref={toast} />
            <div className="nf-card">

                <div className="nf-field">
                    <label>Title</label>
                    <InputText value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>

                <div className="nf-field">
                    <label>Content</label>
                    <InputTextarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        autoResize
                        rows={5}
                    />
                </div>

                {/* Row: Severity / Type / Broadcast */}
                <div className="nf-grid nf-row-3">
                    <div className="nf-field">
                        <label>Severity</label>
                        <Dropdown
                            value={form.severity}
                            options={[
                                { label: "Info (0)", value: 0 },
                                { label: "Normal (1)", value: 1 },
                                { label: "Urgent (2)", value: 2 },
                            ]}
                            onChange={(e) => setForm({ ...form, severity: e.value })}
                            placeholder="Select severity"
                        />
                    </div>

                    <div className="nf-field">
                        <label>Type</label>
                        <Dropdown
                            value={form.notificationTypeId}
                            options={typeOptions}
                            onChange={(e) => setForm({ ...form, notificationTypeId: e.value })}
                            placeholder="Chọn loại"
                            loading={typeOptions.length === 0}
                            showClear
                        />
                    </div>

                    <div className="nf-field">
                        <label>Broadcast</label>
                        <div className="nf-checkbox-row">
                            <Checkbox
                                inputId="broadcast"
                                onChange={(e) => setForm({ ...form, broadcast: e.checked })}
                                checked={form.broadcast}
                            />
                            <label htmlFor="broadcast" className="m-0">Gửi cho tất cả</label>
                        </div>
                    </div>
                </div>

                {/* Row: Roles / URL */}
                <div className="nf-grid nf-row-2">
                    <div className="nf-field">
                        <label>Target roles</label>
                        <MultiSelect
                            value={form.targetRoles}
                            options={roleOptions}
                            onChange={(e) => setForm({ ...form, targetRoles: e.value })}
                            placeholder="Chọn vai trò"
                            display="chip"
                            filter
                            showClear
                        />
                    </div>
                    <div className="nf-field">
                        <label>URL (tuỳ chọn)</label>
                        <InputText value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                    </div>
                </div>

                {/* Row: Users / Courses */}
                <div className="nf-grid nf-row-2">
                    <div className="nf-field">
                        <label>Users</label>
                        <AutoComplete
                            multiple
                            value={form.targetUsers}
                            suggestions={userSug}
                            completeMethod={onCompleteUsers}
                            onFocus={preopenUsers}
                            onDropdownClick={preopenUsers}
                            onChange={(e) => setForm({ ...form, targetUsers: e.value })}
                            field="name"
                            itemTemplate={userItemTpl}
                            placeholder="Gõ để lọc hoặc bấm ▼ để xem tất cả"
                            dropdown
                            minLength={0}
                            forceSelection={false}
                            virtualScrollerOptions={{ itemSize: 50 }}
                            loading={!!loadingUser}
                            appendTo="self"
                            panelClassName="ac-panel"
                            panelStyle={{ width: "100%", maxHeight: 280, overflow: "auto" }}
                            className="ac-control"
                            emptyMessage="Không có dữ liệu"
                            emptyFilterMessage="Không tìm thấy"
                        />
                    </div>

                    <div className="nf-field">
                        <label>Courses</label>
                        <AutoComplete
                            multiple
                            value={form.targetCourses}
                            suggestions={courseSug}
                            completeMethod={onCompleteCourses}
                            onFocus={preopenCourses}
                            onDropdownClick={preopenCourses}
                            onChange={(e) => setForm({ ...form, targetCourses: e.value })}
                            field="code"
                            itemTemplate={courseItemTpl}
                            placeholder="Gõ để lọc hoặc bấm ▼ để xem tất cả"
                            dropdown
                            minLength={0}
                            forceSelection={false}
                            virtualScrollerOptions={{ itemSize: 50 }}
                            loading={!!loadingCourse}
                            appendTo="self"
                            panelClassName="ac-panel"
                            panelStyle={{ width: "100%", maxHeight: 280, overflow: "auto" }}
                            className="ac-control"
                            emptyMessage="Không có dữ liệu"
                            emptyFilterMessage="Không tìm thấy"
                        />
                    </div>
                </div>

                {/* Programs */}
                <div className="nf-field">
                    <label>Programs</label>
                    <AutoComplete
                        multiple
                        value={form.targetPrograms}
                        suggestions={programSug}
                        completeMethod={onCompletePrograms}
                        onFocus={preopenPrograms}
                        onDropdownClick={preopenPrograms}
                        onChange={(e) => setForm({ ...form, targetPrograms: e.value })}
                        field="name"
                        itemTemplate={programItemTpl}
                        placeholder="Gõ để lọc hoặc bấm ▼ để xem tất cả"
                        dropdown
                        minLength={0}
                        forceSelection={false}
                        virtualScrollerOptions={{ itemSize: 50 }}
                        loading={!!loadingProgram}
                        appendTo="self"
                        panelClassName="ac-panel"
                        panelStyle={{ width: "100%", maxHeight: 280, overflow: "auto" }}
                        className="ac-control"
                        emptyMessage="Không có dữ liệu"
                        emptyFilterMessage="Không tìm thấy"
                    />
                </div>

                {/* Schedule */}
                <div className="nf-field">
                    <label>Scheduled date (tuỳ chọn)</label>
                    <Calendar
                        value={form.scheduledDate}
                        showTime
                        hourFormat="24"
                        onChange={(e) => setForm({ ...form, scheduledDate: e.value })}
                        placeholder="Chọn thời điểm gửi (để trống = gửi ngay)"
                    />
                </div>

                <div className="nf-actions">
                    <Button label="Gửi ngay / Hẹn giờ" icon="pi pi-send" onClick={onSubmit} />
                    <Button
                        label="Reset"
                        icon="pi pi-refresh"
                        className="p-button-outlined"
                        onClick={() =>
                            setForm({
                                title: "",
                                content: "",
                                severity: 1,
                                url: "",
                                notificationTypeId: typeOptions?.[0]?.value ?? null,
                                broadcast: false,
                                targetRoles: [],
                                targetUsers: [],
                                targetCourses: [],
                                targetPrograms: [],
                                scheduledDate: null,
                            })
                        }
                    />
                </div>

            </div>
        </div>
    );
}
