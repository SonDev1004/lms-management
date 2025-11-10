import { useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

import {
    sendNotification,
    getNotificationTypes,
    getRoleOptions,
    searchUsers,
    searchCourses,
    searchPrograms,
} from "@/features/notification/api/notificationService";

/* ===== Helpers ===== */
function toIsoLocal(date) {
    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date(date);
    return (
        [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-") +
        "T" +
        [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(":")
    );
}

function cleanPayload(raw) {
    const out = { ...raw };

    // numbers
    out.severity = Number(out.severity);
    out.notificationTypeId = Number(out.notificationTypeId);

    // scheduled date
    if (out.scheduledDate) out.scheduledDate = toIsoLocal(out.scheduledDate);
    else delete out.scheduledDate;

    // convert selected objects -> ids
    if (Array.isArray(out.targetUsers)) {
        out.targetUserIds = out.targetUsers.map((u) => u.id);
        delete out.targetUsers;
    }
    if (Array.isArray(out.targetCourses)) {
        out.targetCourseIds = out.targetCourses.map((c) => c.id);
        delete out.targetCourses;
    }
    if (Array.isArray(out.targetPrograms)) {
        out.targetProgramIds = out.targetPrograms.map((p) => p.id);
        delete out.targetPrograms;
    }

    // drop empty arrays
    ["targetRoles", "targetUserIds", "targetCourseIds", "targetProgramIds"].forEach((k) => {
        if (!Array.isArray(out[k]) || out[k].length === 0) delete out[k];
    });

    // optional url
    if (!out.url?.trim()) delete out.url;

    return out;
}

// simple debounce
function useDebouncedCallback(cb, delay = 400) {
    const t = useRef();
    return (...args) => {
        clearTimeout(t.current);
        t.current = setTimeout(() => cb(...args), delay);
    };
}

export default function NotificationForm() {
    const toast = useRef(null);

    // form
    const [form, setForm] = useState({
        title: "",
        content: "",
        severity: 1,
        url: "",
        notificationTypeId: null, // sẽ load từ API
        broadcast: false,

        targetRoles: [],
        targetUsers: [], // array of {id, name, email}
        targetCourses: [], // array of {id, code, title}
        targetPrograms: [], // array of {id, name}

        scheduledDate: null,
    });

    // options
    const [typeOptions, setTypeOptions] = useState([]);    // [{label, value}]
    const [roleOptions, setRoleOptions] = useState([]);    // [{label, value}]

    // suggestions (autocomplete)
    const [userSug, setUserSug] = useState([]);
    const [courseSug, setCourseSug] = useState([]);
    const [programSug, setProgramSug] = useState([]);

    // ======= load dropdown options from API =======
    useEffect(() => {
        (async () => {
            try {
                const [types, roles] = await Promise.all([getNotificationTypes(), getRoleOptions()]);
                setTypeOptions(types); // [{label, value}]
                setRoleOptions(roles); // [{label, value}]
                // nếu backend có "default type", set vào form:
                if (!form.notificationTypeId && types?.length) {
                    setForm((s) => ({ ...s, notificationTypeId: types[0].value }));
                }
            } catch (e) {
                toast.current?.show({ severity: "error", summary: "Không tải được options", detail: e?.detail || e?.message });
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ======= search handlers (debounced) =======
    const searchUserDebounced = useDebouncedCallback(async (q) => {
        const items = await searchUsers(q);
        setUserSug(items);
    });

    const searchCourseDebounced = useDebouncedCallback(async (q) => {
        const items = await searchCourses(q);
        setCourseSug(items);
    });

    const searchProgramDebounced = useDebouncedCallback(async (q) => {
        const items = await searchPrograms(q);
        setProgramSug(items);
    });

    // ======= submit =======
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

            const payload = cleanPayload(form);
            if (import.meta.env.DEV) console.log("[NOTI] payload", payload);

            await sendNotification(payload);

            toast.current?.show({ severity: "success", summary: "Đã gửi", detail: "Thông báo đã gửi / hẹn giờ." });
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
            toast.current?.show({ severity: "error", summary: `Lỗi${status ? ` ${status}` : ""}`, detail: msg, life: 6500 });
            if (import.meta.env.DEV) console.error(e);
        }
    };

    // ======= item templates (autocomplete chips & suggestions) =======
    const userItemTpl = (u) => (
        <div className="flex flex-column">
            <span className="font-semibold">{u.name || u.fullName || `User #${u.id}`}</span>
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
        <div className="p-4">
            <Toast ref={toast} />
            <div className="grid gap-3" style={{ maxWidth: 920 }}>
                <div className="field">
                    <label>Title</label>
                    <InputText value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>

                <div className="field">
                    <label>Content</label>
                    <InputTextarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        autoResize
                        rows={5}
                    />
                </div>

                <div className="grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}>
                    <div className="field">
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

                    <div className="field">
                        <label>Type</label>
                        <Dropdown
                            value={form.notificationTypeId}
                            options={typeOptions}
                            onChange={(e) => setForm({ ...form, notificationTypeId: e.value })}
                            placeholder="Chọn loại"
                            loading={typeOptions.length === 0}
                        />
                    </div>

                    <div className="field">
                        <label>Broadcast</label>
                        <div className="flex align-items-center gap-2" style={{ height: 40 }}>
                            <Checkbox
                                inputId="broadcast"
                                onChange={(e) => setForm({ ...form, broadcast: e.checked })}
                                checked={form.broadcast}
                            />
                            <label htmlFor="broadcast" className="m-0">Gửi cho tất cả</label>
                        </div>
                    </div>
                </div>

                <div className="grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                    <div className="field">
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
                    <div className="field">
                        <label>URL (tuỳ chọn)</label>
                        <InputText value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
                    </div>
                </div>

                <div className="grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
                    <div className="field">
                        <label>Users</label>
                        <AutoComplete
                            multiple
                            value={form.targetUsers}
                            suggestions={userSug}
                            completeMethod={(e) => searchUserDebounced(e.query || "")}
                            onChange={(e) => setForm({ ...form, targetUsers: e.value })}
                            field="name"
                            itemTemplate={userItemTpl}
                            placeholder="Tìm theo tên/email…"
                            dropdown
                        />
                    </div>
                    <div className="field">
                        <label>Courses</label>
                        <AutoComplete
                            multiple
                            value={form.targetCourses}
                            suggestions={courseSug}
                            completeMethod={(e) => searchCourseDebounced(e.query || "")}
                            onChange={(e) => setForm({ ...form, targetCourses: e.value })}
                            field="code"
                            itemTemplate={courseItemTpl}
                            placeholder="Tìm theo mã/tên khoá…"
                            dropdown
                        />
                    </div>
                </div>

                <div className="field">
                    <label>Programs</label>
                    <AutoComplete
                        multiple
                        value={form.targetPrograms}
                        suggestions={programSug}
                        completeMethod={(e) => searchProgramDebounced(e.query || "")}
                        onChange={(e) => setForm({ ...form, targetPrograms: e.value })}
                        field="name"
                        itemTemplate={programItemTpl}
                        placeholder="Tìm chương trình…"
                        dropdown
                    />
                </div>

                <div className="field">
                    <label>Scheduled date (tuỳ chọn)</label>
                    <Calendar
                        value={form.scheduledDate}
                        showTime
                        hourFormat="24"
                        onChange={(e) => setForm({ ...form, scheduledDate: e.value })}
                        placeholder="Chọn thời điểm gửi (để trống = gửi ngay)"
                    />
                </div>

                <div className="flex gap-2 mt-2">
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
