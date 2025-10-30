import { useRef, useState } from "react";
import { sendNotification } from "@/features/notification/api/notificationService";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const roleOptions = [
    { label: "Student", value: "STUDENT" },
    { label: "Teacher", value: "TEACHER" },
    { label: "Staff", value: "STAFF" },
];

const toIsoLocal = (d) => {
    if (!d) return null;
    const pad = (n) => `${n}`.padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function NotificationForm() {
    const toast = useRef(null);
    const [form, setForm] = useState({
        title: "",
        content: "",
        severity: 1,
        url: "",
        notificationTypeId: 1,
        broadcast: false,
        targetRoles: [],
        targetUserIds: [],
        targetCourseIds: [],
        targetProgramIds: [],
        scheduledDate: null,
    });

    const onSubmit = async () => {
        try {
            const payload = { ...form, scheduledDate: toIsoLocal(form.scheduledDate) };
            await sendNotification(payload);
            toast.current.show({ severity: "success", summary: "OK", detail: "Đã gửi / hẹn giờ thông báo" });
            setForm((s) => ({ ...s, title: "", content: "", scheduledDate: null, targetRoles: [] }));
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            toast.current.show({ severity: "error", summary: "Lỗi", detail: "Không thể gửi thông báo" });
        }
    };

    return (
        <div className="p-5 bg-white rounded-xl shadow-sm">
            <Toast ref={toast} />
            <h2 className="text-lg font-bold mb-3">Gửi / Hẹn giờ thông báo</h2>

            <div className="grid gap-3">
        <span className="p-float-label">
          <InputText id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full" />
          <label htmlFor="title">Tiêu đề</label>
        </span>

                <span className="p-float-label">
          <InputTextarea id="content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full" />
          <label htmlFor="content">Nội dung (HTML/text)</label>
        </span>

                <div className="grid grid-cols-2 gap-3">
          <span className="p-float-label">
            <InputText id="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="w-full" />
            <label htmlFor="url">URL (tuỳ chọn)</label>
          </span>
                    <span className="p-float-label">
            <InputText id="severity" value={form.severity} onChange={(e) => setForm({ ...form, severity: Number(e.target.value) })} className="w-full" />
            <label htmlFor="severity">Severity (1–5)</label>
          </span>
                </div>

                <Dropdown value={form.targetRoles} options={roleOptions} onChange={(e) => setForm({ ...form, targetRoles: e.value })} optionLabel="label" optionValue="value" multiple placeholder="Chọn Role nhận" className="w-full" />

                <div className="flex items-center gap-2">
                    <label>Hẹn giờ gửi:</label>
                    <Calendar showTime hourFormat="24" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.value })} />
                </div>

                <div className="flex gap-2">
                    <Button label="Gửi ngay / Hẹn giờ" onClick={onSubmit} />
                </div>
            </div>
        </div>
    );
}
