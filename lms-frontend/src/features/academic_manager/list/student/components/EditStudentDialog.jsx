import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import "../styles/EditStudentDialog.css";

import '../styles/student-management.css';
import { classes, studentStatusOptions, upsertStudent } from "@/features/academic_manager/list/student/mocks/students.js";

const empty = {
    id: "", name: "", email: "", phone: "", avatar: "",
    class: "", status: "active", enrolledOn: "", gpa: 0
};

export default function EditStudentDialog({ open, onClose, student, onSaved }) {
    const [form, setForm] = useState(empty);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!student) return;
        const f = {
            ...empty,
            ...student,
            enrolledOn: student.enrolledOn ? new Date(student.enrolledOn) : null
        };
        setForm(f);
        setPreview(student.avatar || "");
        setErrors({});
    }, [student, open]);

    const canSubmit = useMemo(() => {
        return form.id && form.name && form.email && form.class && form.status;
    }, [form]);

    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const onPickImage = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setPreview(url);
        set("avatar", url);
    };

    const validate = () => {
        const next = {};
        if (!form.id) next.id = "Required";
        if (!form.name.trim()) next.name = "Required";
        if (!/^\S+@\S+\.\S+$/.test(form.email || "")) next.email = "Email invalid";
        if (!form.class) next.class = "Required";
        if (!form.status) next.status = "Required";
        if (form.gpa < 0 || form.gpa > 4) next.gpa = "0–4.00";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setSubmitting(true);
            const payload = {
                ...form,
                enrolledOn: form.enrolledOn ? form.enrolledOn.toISOString().slice(0, 10) : null,
                avatar: preview || form.avatar || "",
            };
            const saved = upsertStudent(payload);
            onSaved?.(saved);
            onClose?.();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            header="Edit Student Profile"
            visible={open}
            style={{ width: "640px", maxWidth: "95vw" }}
            modal
            onHide={onClose}
            className="sp-edit-dialog"
        >
            <div className="p-fluid" style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16 }}>
                {/* Avatar */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <img
                        src={preview || `https://i.pravatar.cc/120?u=${form.id || "x"}`}
                        alt="avatar"
                        style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "1px solid #e8ecf2" }}
                    />
                    <label className="p-button p-button-text" style={{ cursor: "pointer" }}>
                        <i className="pi pi-upload" style={{ marginRight: 8 }} /> Change photo
                        <input type="file" accept="image/*" onChange={onPickImage} hidden />
                    </label>
                </div>

                {/* Fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field">
                        <label>ID</label>
                        <InputText value={form.id} onChange={(e) => set("id", e.target.value.toUpperCase())} />
                        {errors.id && <small className="p-error">{errors.id}</small>}
                    </div>

                    <div className="field">
                        <label>GPA</label>
                        <InputNumber
                            value={form.gpa}
                            onValueChange={(e) => set("gpa", e.value ?? 0)}
                            mode="decimal"
                            minFractionDigits={2}
                            maxFractionDigits={2}
                            step={0.01}
                            min={0}
                            max={4}
                        />
                        {errors.gpa && <small className="p-error">{errors.gpa}</small>}
                    </div>

                    <div className="field" style={{ gridColumn: "1 / span 2" }}>
                        <label>Name</label>
                        <InputText value={form.name} onChange={(e) => set("name", e.target.value)} />
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>

                    <div className="field" style={{ gridColumn: "1 / span 2" }}>
                        <label>Email</label>
                        <InputText value={form.email} onChange={(e) => set("email", e.target.value)} />
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>

                    <div className="field">
                        <label>Phone</label>
                        <InputText value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                    </div>

                    <div className="field">
                        <label>Class</label>
                        <Dropdown
                            options={classes}
                            optionLabel="label"
                            optionValue="value"
                            value={form.class}
                            onChange={(e) => set("class", e.value)}
                            placeholder="Select class"
                            showClear
                        />
                        {errors.class && <small className="p-error">{errors.class}</small>}
                    </div>

                    <div className="field">
                        <label>Status</label>
                        <Dropdown
                            options={studentStatusOptions}
                            optionLabel="label"
                            optionValue="value"
                            value={form.status}
                            onChange={(e) => set("status", e.value)}
                        />
                        {errors.status && <small className="p-error">{errors.status}</small>}
                    </div>

                    <div className="field">
                        <label>Enrolled</label>
                        <Calendar
                            value={form.enrolledOn}
                            onChange={(e) => set("enrolledOn", e.value)}
                            dateFormat="mm/dd/yy"
                            showIcon
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
                <Button label="Cancel" className="p-button-text" onClick={onClose} />
                <Button
                    label="Save Changes"
                    icon="pi pi-check"
                    onClick={handleSave}
                    disabled={!canSubmit || submitting}
                />
            </div>
        </Dialog>
    );
}
