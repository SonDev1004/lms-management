import React, { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const empty = {
    id: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
    department: "",
    subjects: [],
    employmentType: "full",
    status: "active",
    hiredOn: null,
    teachingLoad: 0,
    certifications: [],
    homeroomOf: ""
};

export default function EditTeacherDialog({
                                              open,
                                              onClose,
                                              teacher,
                                              onSaved,
                                              departments = [],
                                              statusOptions = [],
                                              empTypes = [],
                                              subjects = [],
                                              dialogClassName = "teacher-edit-dialog",   // ⚠️ dùng chung CSS với Add
                                          }) {
    const [form, setForm] = useState(empty);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const t = teacher || {};
        const init = {
            ...empty,
            ...t,
            hiredOn: t.hiredOn ? new Date(t.hiredOn) : null,
            subjects: Array.isArray(t.subjects) ? t.subjects : [],
            certifications: Array.isArray(t.certifications) ? t.certifications : []
        };
        setForm(init);
        setPreview(t.avatar || "");
        setErrors({});
    }, [teacher, open]);

    const canSubmit = useMemo(() => {
        return form.id && form.name && form.email && form.department && form.status;
    }, [form]);

    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const onPickImage = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const url = URL.createObjectURL(f);
        setPreview(url);
        set("avatar", url);
    };

    const normalizeOptions = (opts) => {
        if (!opts?.length) return [];
        return typeof opts[0] === "string"
            ? opts.map((x) => ({ label: x, value: x }))
            : opts;
    };

    const validate = () => {
        const next = {};
        if (!form.id) next.id = "Required";
        if (!form.name?.trim()) next.name = "Required";
        if (!/^\S+@\S+\.\S+$/.test(form.email || "")) next.email = "Email invalid";
        if (!form.department) next.department = "Required";
        if (!form.status) next.status = "Required";
        if (form.teachingLoad < 0) next.teachingLoad = ">= 0";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setSubmitting(true);
            const payload = {
                ...form,
                hiredOn: form.hiredOn ? form.hiredOn.toISOString().slice(0, 10) : null,
                avatar: preview || form.avatar || ""
            };
            onSaved?.(payload);
            onClose?.();
        } finally {
            setSubmitting(false);
        }
    };

    const subjectOpts = normalizeOptions(subjects);

    return (
        <Dialog
            header="Edit Teacher Profile"
            visible={open}
            style={{ width: "720px", maxWidth: "95vw" }}
            modal
            onHide={onClose}
            className={dialogClassName}
        >
            <div className="form-grid">
                {/* Avatar */}
                <aside className="avatar-card" aria-label="avatar uploader">
                    <img
                        src={preview || `https://i.pravatar.cc/160?u=${form.id || "x"}`}
                        alt="avatar"
                        className="avatar"
                    />
                    <label className="p-button p-button-text" style={{ cursor: "pointer" }}>
                        <i className="pi pi-upload" style={{ marginRight: 8 }} /> Change photo
                        <input type="file" accept="image/*" onChange={onPickImage} hidden />
                    </label>
                </aside>

                {/* Fields */}
                <section className="form-fields">
                    <div className="form-group">
                        <label>Code</label>
                        <InputText
                            value={form.id}
                            onChange={(e) => set("id", e.target.value.toUpperCase())}
                        />
                        {errors.id && <div className="field-error">{errors.id}</div>}
                    </div>

                    <div className="form-group">
                        <label>Teaching Load (periods/week)</label>
                        <InputNumber
                            value={form.teachingLoad}
                            onValueChange={(e) => set("teachingLoad", e.value ?? 0)}
                            min={0}
                        />
                        {errors.teachingLoad && (
                            <div className="field-error">{errors.teachingLoad}</div>
                        )}
                    </div>

                    <div className="form-group" style={{ gridColumn: "1 / span 2" }}>
                        <label>Name</label>
                        <InputText
                            value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                        />
                        {errors.name && <div className="field-error">{errors.name}</div>}
                    </div>

                    <div className="form-group" style={{ gridColumn: "1 / span 2" }}>
                        <label>Email</label>
                        <InputText
                            value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                        />
                        {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <InputText
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Department</label>
                        <Dropdown
                            options={departments}
                            optionLabel="label"
                            optionValue="value"
                            value={form.department}
                            onChange={(e) => set("department", e.value)}
                            placeholder="Select department"
                            showClear
                        />
                        {errors.department && (
                            <div className="field-error">{errors.department}</div>
                        )}
                    </div>

                    <div className="form-group" style={{ gridColumn: "1 / span 2" }}>
                        <label>Subjects</label>
                        <MultiSelect
                            value={form.subjects}
                            options={subjectOpts}
                            onChange={(e) => set("subjects", e.value)}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select one or more subjects"
                            display="chip"
                            className="w-full"
                        />
                    </div>

                    <div className="form-group">
                        <label>Employment</label>
                        <Dropdown
                            options={empTypes}
                            optionLabel="label"
                            optionValue="value"
                            value={form.employmentType}
                            onChange={(e) => set("employmentType", e.value)}
                            placeholder="Full-time / Part-time"
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <Dropdown
                            options={statusOptions}
                            optionLabel="label"
                            optionValue="value"
                            value={form.status}
                            onChange={(e) => set("status", e.value)}
                            placeholder="Active / On leave / Resigned"
                        />
                        {errors.status && (
                            <div className="field-error">{errors.status}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Hired On</label>
                        <Calendar
                            value={form.hiredOn}
                            onChange={(e) => set("hiredOn", e.value)}
                            dateFormat="mm/dd/yy"
                            showIcon
                        />
                    </div>

                    <div className="form-group">
                        <label>Homeroom Of</label>
                        <InputText
                            value={form.homeroomOf}
                            onChange={(e) => set("homeroomOf", e.target.value)}
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: "1 / span 2" }}>
                        <label>Certifications (comma separated)</label>
                        <InputText
                            value={(form.certifications || []).join(", ")}
                            onChange={(e) =>
                                set(
                                    "certifications",
                                    e.target.value
                                        .split(",")
                                        .map((x) => x.trim())
                                        .filter(Boolean)
                                )
                            }
                            placeholder="PGCE, TESOL, ..."
                        />
                    </div>
                </section>
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
