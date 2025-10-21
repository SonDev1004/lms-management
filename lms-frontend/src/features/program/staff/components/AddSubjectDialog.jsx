import React, { useMemo, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import '../styles/dialog-forms.css';

export default function AddSubjectDialog({
                                             visible, onClose, programs = [], defaultProgramId = null, onSave,
                                         }) {
    const levelOptions = useMemo(() => ([
        { label: "Pre A1–A1", value: "Pre A1–A1" },
        { label: "A1–A2", value: "A1–A2" },
        { label: "A2–B1", value: "A2–B1" },
        { label: "B1–B2", value: "B1–B2" },
        { label: "B2–C1", value: "B2–C1" },
    ]), []);
    const statusOptions = useMemo(() => ([
        { label: "active", value: "active" },
        { label: "inactive", value: "inactive" },
    ]), []);
    const programOptions = useMemo(
        () => programs.map(p => ({ label: `${p.name} (${p.id})`, value: p.id })), [programs]
    );

    const [form, setForm] = useState({
        programId: defaultProgramId,
        name: "", level: "A2–B1", sessions: 16, fee: 0, status: "active",
    });

    const firstInputRef = useRef(null);

    useEffect(() => {
        if (!visible) return;
        setForm(s => ({
            ...s,
            programId: defaultProgramId ?? programOptions[0]?.value ?? null,
        }));
        const t = setTimeout(() => firstInputRef.current?.focus(), 0);
        return () => clearTimeout(t);
    }, [visible, defaultProgramId, programOptions]);

    const canSave =
        !!form.programId &&
        form.name.trim().length >= 3 &&
        (form.sessions ?? 0) >= 0 &&
        (form.fee ?? 0) >= 0;

    function handleSave() {
        if (!canSave) return;
        onSave?.({
            programId: form.programId,
            name: form.name.trim(),
            level: form.level,
            sessions: form.sessions ?? 0,
            fee: form.fee ?? 0,
            status: form.status,
        });
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && canSave) { e.preventDefault(); handleSave(); }
        if (e.key === "Escape") onClose?.();
    }

    return (
        <Dialog
            header="Add Subject to Program"
            visible={visible}
            modal
            className="dlg"
            style={{ width: 640, maxWidth: "94vw" }}
            breakpoints={{ "1200px": "640px", "768px": "92vw" }}
            onHide={onClose}
            blockScroll
        >
            <div className="dlg-scroll" onKeyDown={handleKeyDown} tabIndex={-1}>
                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Basics</h4>
                    <div className="frm-grid">
                        <div className="frm-field">
                            <label htmlFor="sj-program">Program</label>
                            <Dropdown
                                inputId="sj-program"
                                value={form.programId}
                                options={programOptions}
                                onChange={(e) => setForm(s => ({ ...s, programId: e.value }))}
                                placeholder="Select program"
                                showClear
                                className={!form.programId ? "p-invalid" : ""}
                            />
                            {!form.programId && <div className="error">Chọn một chương trình.</div>}
                        </div>

                        <div className="frm-field">
                            <label htmlFor="sj-name">Subject name <span className="req">*</span></label>
                            <InputText
                                id="sj-name"
                                ref={firstInputRef}
                                value={form.name}
                                onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
                                placeholder="e.g. IELTS Writing Booster"
                                className={!form.name?.trim() ? "p-invalid" : ""}
                            />
                            {!form.name?.trim() && <div className="hint">Tên tối thiểu 3 ký tự.</div>}
                        </div>
                    </div>
                </section>

                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Details</h4>
                    <div className="frm-grid">
                        <div className="frm-field">
                            <label htmlFor="sj-level">Level (CEFR)</label>
                            <Dropdown inputId="sj-level" value={form.level} options={levelOptions}
                                      onChange={(e) => setForm(s => ({ ...s, level: e.value }))}/>
                        </div>

                        <div className="frm-field">
                            <label htmlFor="sj-sessions">Sessions</label>
                            <InputNumber
                                inputId="sj-sessions"
                                value={form.sessions}
                                onValueChange={(e) => setForm(s => ({ ...s, sessions: e.value ?? 0 }))}
                                showButtons
                                buttonLayout="vertical"
                                incrementButtonIcon="pi pi-chevron-up"
                                decrementButtonIcon="pi pi-chevron-down"
                                incrementButtonClassName="apd-step"
                                decrementButtonClassName="apd-step"
                                min={0}
                            />
                        </div>

                        <div className="frm-field">
                            <label htmlFor="sj-fee">Tuition (VND)</label>
                            <InputNumber
                                inputId="sj-fee"
                                value={form.fee}
                                onValueChange={(e) => setForm(s => ({ ...s, fee: e.value ?? 0 }))}
                                mode="currency" currency="VND" locale="vi-VN"
                            />
                            <div className="hint">Học phí cho môn học.</div>
                        </div>

                        <div className="frm-field">
                            <label htmlFor="sj-status">Status</label>
                            <Dropdown inputId="sj-status" value={form.status} options={statusOptions}
                                      onChange={(e) => setForm(s => ({ ...s, status: e.value }))}/>
                        </div>
                    </div>
                </section>
            </div>

            <div className="dlg-footer">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onClose}/>
                <Button label="Save" icon="pi pi-check" onClick={handleSave} disabled={!canSave}/>
            </div>
        </Dialog>
    );
}
