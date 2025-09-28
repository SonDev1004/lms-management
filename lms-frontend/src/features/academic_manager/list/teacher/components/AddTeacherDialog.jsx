import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const isPhone = (v) => /^[\d\s+()-]{6,}$/.test(v || "");

export default function AddTeacherDialog({
                                             open,
                                             onClose,
                                             onSaved,
                                             departments = [],
                                             statusOptions = [],
                                             empTypes = [],
                                             subjects = [],
                                             dialogClassName = "teacher-edit-dialog",
                                         }) {
    const fileRef = useRef(null);
    const nameRef = useRef(null);

    const defaults = useMemo(
        () => ({
            id: "",
            code: "",
            name: "",
            email: "",
            phone: "",
            department: null,
            subjects: [],
            employmentType: empTypes?.[0]?.value ?? "Full-time",
            status: statusOptions?.[0]?.value ?? "active",
            teachingLoad: 0,
            hiredDate: null,
            avatarUrl: "",
        }),
        [empTypes, statusOptions]
    );

    const [form, setForm] = useState(defaults);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(defaults);
            setErrors({});
            setDirty(false);
            setSaving(false);
            setShowBanner(false);
            setTimeout(() => nameRef.current?.focus(), 60);
        }
    }, [open, defaults]);

    useEffect(() => {
        if (!form.name || form.code?.trim()) return;
        const code = form.name
            .trim()
            .replace(/\s+/g, ".")
            .replace(/[^a-zA-Z.]/g, "")
            .toLowerCase()
            .slice(0, 24);
        if (code) setForm((s) => ({ ...s, code }));
    }, [form.name]);

    const setVal = (key, val) => {
        setDirty(true);
        setForm((s) => ({ ...s, [key]: val }));
    };

    const onPickAvatar = () => fileRef.current?.click();
    const onFile = (e) => {
        const file = e.target?.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setVal("avatarUrl", reader.result);
        reader.readAsDataURL(file);
    };

    const validate = useCallback(
        (draft = form) => {
            const e = {};
            if (!draft.name?.trim()) e.name = "Name is required.";
            if (!draft.department) e.department = "Department is required.";
            if (draft.email && !isEmail(draft.email)) e.email = "Invalid email format.";
            if (draft.phone && !isPhone(draft.phone)) e.phone = "Invalid phone format.";
            if (draft.teachingLoad < 0 || draft.teachingLoad > 60)
                e.teachingLoad = "Load must be 0–60.";
            return e;
        },
        [form]
    );

    const canSave = Object.keys(validate()).length === 0 && !saving;

    const doSave = async (andReset = false) => {
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) {
            setShowBanner(true);
            return;
        }
        try {
            setSaving(true);
            const payload = {
                ...form,
                hiredDate: form.hiredDate ? new Date(form.hiredDate).toISOString() : null,
            };
            await Promise.resolve();
            onSaved?.(payload);
            if (andReset) {
                setForm(defaults);
                setErrors({});
                setDirty(false);
                setShowBanner(false);
                setTimeout(() => nameRef.current?.focus(), 60);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleHide = () => {
        if (!dirty) return onClose?.();
        if (window.confirm("Discard changes?")) onClose?.();
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && canSave) {
            e.preventDefault();
            doSave(false);
        }
        if (e.key === "Escape") handleHide();
    };

    const footer = (
        <div className="flex gap-2 justify-end">
            <Button
                label="Cancel"
                className="p-button-text"
                onClick={handleHide}
                disabled={saving}
            />
            <Button
                label={saving ? "Saving..." : "Save"}
                icon="pi pi-check"
                className="p-button-primary"
                onClick={() => doSave(false)}
                disabled={!canSave}
            />
            <Button
                label="Save & Add another"
                icon="pi pi-plus"
                onClick={() => doSave(true)}
                disabled={!canSave}
            />
        </div>
    );

    return (
        <Dialog
            visible={open}
            onHide={handleHide}
            header="Add New Teacher"
            className={dialogClassName}
            footer={footer}
            blockScroll
            dismissableMask={!dirty}
            closable
            onKeyDown={onKeyDown}
        >
            {showBanner && Object.keys(errors).length > 0 && (
                <div
                    className="p-2 mb-3"
                    style={{
                        background: "color-mix(in oklab, var(--tg-danger) 10%, transparent)",
                        border: "1px solid color-mix(in oklab, var(--tg-danger) 35%, var(--tg-border))",
                        borderRadius: 10,
                        color: "var(--tg-text-900)",
                    }}
                >
                    Please fix the highlighted fields.
                </div>
            )}

            <div className="form-grid">
                <aside className="avatar-card" aria-label="avatar uploader">
                    {form.avatarUrl ? (
                        <img className="avatar" src={form.avatarUrl} alt="avatar" />
                    ) : (
                        <div
                            className="avatar"
                            style={{
                                display: "grid",
                                placeItems: "center",
                                color: "#94a3b8",
                                fontWeight: 800,
                            }}
                        >
                            avatar
                        </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                    <button type="button" className="change-photo" onClick={onPickAvatar}>
                        <i className="pi pi-image" /> Change photo
                    </button>
                    <div className="hint" style={{ marginTop: 10 }}>
                        PNG/JPG, &lt; 1.5MB is recommended.
                    </div>
                </aside>

                <section className="form-fields">
                    <div className="form-group">
                        <label htmlFor="f-name">
                            Name <span style={{ color: "var(--tg-danger)" }}>*</span>
                        </label>
                        <InputText
                            id="f-name"
                            ref={nameRef}
                            value={form.name}
                            onChange={(e) => setVal("name", e.target.value)}
                            className={errors.name ? "p-invalid" : ""}
                            placeholder="Nguyễn Văn A"
                            aria-invalid={!!errors.name}
                            aria-describedby="err-name"
                        />
                        {errors.name && (
                            <div id="err-name" className="field-error">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-code">Code</label>
                        <InputText
                            id="f-code"
                            value={form.code}
                            onChange={(e) => setVal("code", e.target.value)}
                            placeholder="nguyen.van.a"
                        />
                        <div className="hint">Auto from name — you can edit.</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-email">Email</label>
                        <InputText
                            id="f-email"
                            value={form.email}
                            onChange={(e) => setVal("email", e.target.value)}
                            className={errors.email ? "p-invalid" : ""}
                            placeholder="name@school.edu"
                            aria-invalid={!!errors.email}
                            aria-describedby="err-email"
                        />
                        {errors.email && (
                            <div id="err-email" className="field-error">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-phone">Phone</label>
                        <InputText
                            id="f-phone"
                            value={form.phone}
                            onChange={(e) => setVal("phone", e.target.value)}
                            className={errors.phone ? "p-invalid" : ""}
                            placeholder="+84 90 000 0000"
                            aria-invalid={!!errors.phone}
                            aria-describedby="err-phone"
                        />
                        {errors.phone && (
                            <div id="err-phone" className="field-error">
                                {errors.phone}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-dept">
                            Department <span style={{ color: "var(--tg-danger)" }}>*</span>
                        </label>
                        <Dropdown
                            id="f-dept"
                            value={form.department}
                            options={departments}
                            onChange={(e) => setVal("department", e.value)}
                            placeholder="Select department"
                            className={errors.department ? "p-invalid" : ""}
                            optionLabel="label"
                            optionValue="value"
                            showClear
                            aria-invalid={!!errors.department}
                            aria-describedby="err-dept"
                        />
                        {errors.department && (
                            <div id="err-dept" className="field-error">
                                {errors.department}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-subj">Subjects</label>
                        <MultiSelect
                            inputId="f-subj"
                            value={form.subjects}
                            options={subjects}
                            onChange={(e) => setVal("subjects", e.value)}
                            placeholder="Select subjects"
                            display="chip"
                            optionLabel="label"
                            optionValue="value"
                            filter
                            className="w-full"
                        />
                        <div className="hint">You can select multiple subjects.</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-emp">Employment Type</label>
                        <Dropdown
                            id="f-emp"
                            value={form.employmentType}
                            options={empTypes}
                            onChange={(e) => setVal("employmentType", e.value)}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Employment type"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-status">Status</label>
                        <Dropdown
                            id="f-status"
                            value={form.status}
                            options={statusOptions}
                            onChange={(e) => setVal("status", e.value)}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Status"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-load">Teaching Load (hrs/week)</label>
                        <InputNumber
                            inputId="f-load"
                            value={form.teachingLoad}
                            onValueChange={(e) => setVal("teachingLoad", e.value ?? 0)}
                            min={0}
                            max={60}
                            useGrouping={false}
                            showButtons={false}
                        />
                        {errors.teachingLoad && (
                            <div className="field-error">{errors.teachingLoad}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="f-date">Hired Date</label>
                        <Calendar
                            inputId="f-date"
                            value={form.hiredDate}
                            onChange={(e) => setVal("hiredDate", e.value)}
                            dateFormat="dd/mm/yy"
                            showIcon
                            mask="99/99/9999"
                            placeholder="dd/mm/yyyy"
                        />
                    </div>
                </section>
            </div>
        </Dialog>
    );
}
