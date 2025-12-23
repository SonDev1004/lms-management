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
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
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

    const [typeOptions, setTypeOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [userSug, setUserSug] = useState([]);
    const [courseSug, setCourseSug] = useState([]);
    const [programSug, setProgramSug] = useState([]);
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingCourse, setLoadingCourse] = useState(false);
    const [loadingProgram, setLoadingProgram] = useState(false);

    const cacheRef = useRef({ users: null, courses: null, programs: null });
    const userSignal = useAbortable();
    const courseSignal = useAbortable();
    const programSignal = useAbortable();

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
                    summary: "Failed to load options",
                    detail: e?.detail || e?.message || "Unknown error",
                });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const onCompleteUsers = useDebounced((e) => fetchUsers(e.query || ""), 250);
    const onCompleteCourses = useDebounced((e) => fetchCourses(e.query || ""), 250);
    const onCompletePrograms = useDebounced((e) => fetchPrograms(e.query || ""), 250);

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

    const onSubmit = async () => {
        try {
            if (!form.title.trim()) {
                toast.current?.show({ severity: "warn", summary: "Missing Title", detail: "Enter the notification title." });
                return;
            }
            if (!form.content.trim()) {
                toast.current?.show({ severity: "warn", summary: "Missing Content", detail: "Enter notification content." });
                return;
            }
            if (!form.notificationTypeId) {
                toast.current?.show({ severity: "warn", summary: "Missing Type", detail: "Select notification type." });
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
                    summary: "No Recipients",
                    detail: "Enable Broadcast or select at least one role/user/course/program.",
                });
                return;
            }

            await sendNotification(form);

            toast.current?.show({
                severity: "success",
                summary: "Sent Successfully",
                detail: "Notification has been sent or scheduled.",
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
            const msg = e?.detail || e?.response?.data?.message || e?.response?.data?.error || e?.message || "Unable to send notification";
            toast.current?.show({
                severity: "error",
                summary: `Error${status ? ` ${status}` : ""}`,
                detail: msg,
                life: 6500,
            });
        }
    };

    const userItemTpl = (u) => (
        <div className="flex flex-column py-2">
            <span className="font-semibold text-900">{u.name || `User #${u.id}`}</span>
            <small className="text-600">{u.email}</small>
        </div>
    );
    const courseItemTpl = (c) => (
        <div className="flex flex-column py-2">
            <span className="font-semibold text-900">{c.code || `Course #${c.id}`}</span>
            <small className="text-600">{c.title}</small>
        </div>
    );
    const programItemTpl = (p) => (
        <div className="flex flex-column py-2">
            <span className="font-semibold text-900">{p.name || `Program #${p.id}`}</span>
            <small className="text-600">ID: {p.id}</small>
        </div>
    );

    return (
        <div className="p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Toast ref={toast} />

            {/* Header */}
            <div className="mb-4 p-4 bg-white border-round-lg shadow-3">
                <h1 className="m-0 text-3xl font-bold text-900">
                    <i className="pi pi-send mr-3 text-blue-500"></i>
                    Send Notification
                </h1>
                <p className="mt-2 mb-0 text-600">
                    Create and send notifications to users, roles, courses, or programs
                </p>
            </div>

            <Card className="shadow-3">
                {/* Basic Information */}
                <Panel header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-info-circle text-blue-500"></i>
                        <span className="font-semibold">Basic Information</span>
                    </div>
                } toggleable>
                    <div className="grid">
                        <div className="col-12">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-tag mr-2 text-blue-500"></i>
                                    Title *
                                </label>
                                <InputText
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Enter notification title..."
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-align-left mr-2 text-blue-500"></i>
                                    Content *
                                </label>
                                <InputTextarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    autoResize
                                    rows={5}
                                    placeholder="Enter notification content..."
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-exclamation-triangle mr-2 text-orange-500"></i>
                                    Severity
                                </label>
                                <Dropdown
                                    value={form.severity}
                                    options={[
                                        { label: "Info (0)", value: 0 },
                                        { label: "Normal (1)", value: 1 },
                                        { label: "Urgent (2)", value: 2 },
                                    ]}
                                    onChange={(e) => setForm({ ...form, severity: e.value })}
                                    placeholder="Select severity"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-bookmark mr-2 text-purple-500"></i>
                                    Type *
                                </label>
                                <Dropdown
                                    value={form.notificationTypeId}
                                    options={typeOptions}
                                    onChange={(e) => setForm({ ...form, notificationTypeId: e.value })}
                                    placeholder="Select type"
                                    loading={typeOptions.length === 0}
                                    showClear
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-link mr-2 text-green-500"></i>
                                    URL (Optional)
                                </label>
                                <InputText
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </Panel>

                <Divider />

                {/* Recipients */}
                <Panel header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-users text-green-500"></i>
                        <span className="font-semibold">Recipients</span>
                    </div>
                } toggleable>
                    {/* Broadcast Checkbox */}
                    <div className="mb-4 p-3 border-round-lg" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                        <div className="flex align-items-center gap-3">
                            <Checkbox
                                inputId="broadcast"
                                onChange={(e) => setForm({ ...form, broadcast: e.checked })}
                                checked={form.broadcast}
                            />
                            <label htmlFor="broadcast" className="m-0 cursor-pointer">
                                <div className="font-semibold text-900">
                                    <i className="pi pi-megaphone mr-2 text-green-600"></i>
                                    Broadcast to Everyone
                                </div>
                                <small className="text-600">Send this notification to all users in the system</small>
                            </label>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-shield mr-2 text-blue-500"></i>
                                    Target Roles
                                </label>
                                <MultiSelect
                                    value={form.targetRoles}
                                    options={roleOptions}
                                    onChange={(e) => setForm({ ...form, targetRoles: e.value })}
                                    placeholder="Select roles"
                                    display="chip"
                                    filter
                                    showClear
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-user mr-2 text-purple-500"></i>
                                    Target Users
                                </label>
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
                                    placeholder="Search users..."
                                    dropdown
                                    minLength={0}
                                    forceSelection={false}
                                    virtualScrollerOptions={{ itemSize: 50 }}
                                    loading={loadingUser}
                                    className="w-full"
                                    emptyMessage="No users found"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-book mr-2 text-orange-500"></i>
                                    Target Courses
                                </label>
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
                                    placeholder="Search courses..."
                                    dropdown
                                    minLength={0}
                                    forceSelection={false}
                                    virtualScrollerOptions={{ itemSize: 50 }}
                                    loading={loadingCourse}
                                    className="w-full"
                                    emptyMessage="No courses found"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="flex flex-column gap-2">
                                <label className="font-semibold text-900">
                                    <i className="pi pi-graduation-cap mr-2 text-cyan-500"></i>
                                    Target Programs
                                </label>
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
                                    placeholder="Search programs..."
                                    dropdown
                                    minLength={0}
                                    forceSelection={false}
                                    virtualScrollerOptions={{ itemSize: 50 }}
                                    loading={loadingProgram}
                                    className="w-full"
                                    emptyMessage="No programs found"
                                />
                            </div>
                        </div>
                    </div>
                </Panel>

                <Divider />

                {/* Schedule */}
                <Panel header={
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-clock text-orange-500"></i>
                        <span className="font-semibold">Schedule (Optional)</span>
                    </div>
                } toggleable collapsed>
                    <div className="flex flex-column gap-2">
                        <label className="font-semibold text-900">
                            <i className="pi pi-calendar mr-2 text-orange-500"></i>
                            Scheduled Date & Time
                        </label>
                        <Calendar
                            value={form.scheduledDate}
                            showTime
                            hourFormat="24"
                            onChange={(e) => setForm({ ...form, scheduledDate: e.value })}
                            placeholder="Leave blank to send immediately"
                            className="w-full"
                            showIcon
                        />
                        <small className="text-600">
                            <i className="pi pi-info-circle mr-1"></i>
                            If no date is selected, the notification will be sent immediately
                        </small>
                    </div>
                </Panel>

                <Divider />

                {/* Actions */}
                <div className="flex justify-content-between gap-2">
                    <Button
                        label="Reset Form"
                        icon="pi pi-refresh"
                        className="p-button-outlined p-button-secondary"
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
                    <Button
                        label={form.scheduledDate ? "Schedule Notification" : "Send Now"}
                        icon="pi pi-send"
                        onClick={onSubmit}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            border: 'none'
                        }}
                    />
                </div>
            </Card>
        </div>
    );
}