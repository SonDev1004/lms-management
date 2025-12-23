import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "../styles/AddProgram.css";
export default function AddProgramDialog({ visible, onClose, onSave }) {
    const firstRef = useRef(null);
    const statusOpts = [
        { label: "active", value: true },
        { label: "inactive", value: false },
    ];

    const [form, setForm] = useState({
        title: "",
        minStudent: 1,
        maxStudent: 10,
        fee: 0,
        description: "",
        imageUrl: "",
        isActive: true,
    });

    useEffect(() => {
        if (!visible) return;
        setForm({
            title: "",
            minStudent: 1,
            maxStudent: 10,
            fee: 0,
            description: "",
            imageUrl: "",
            isActive: true,
        });
        const t = setTimeout(() => firstRef.current?.focus(), 30);
        return () => clearTimeout(t);
    }, [visible]);

    const canSave =
        form.title?.trim().length >= 3 &&
        (form.minStudent ?? 0) >= 1 &&
        (form.maxStudent ?? 0) >= (form.minStudent ?? 1) &&
        (form.fee ?? 0) >= 0;

    return (
        <Dialog
            header="Add Program"
            visible={visible}
            modal
            className="dlg"
            style={{ width: 640, maxWidth: "94vw" }}
            breakpoints={{ "1200px": "640px", "768px": "92vw" }}
            onHide={onClose}
            blockScroll
        >
            <div className="dlg-scroll">
                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Basics</h4>
                    <div className="frm-grid">
                        <div className="frm-field" style={{ gridColumn: "1 / -1" }}>
                            <label>
                                Title <span className="req">*</span>
                            </label>
                            <InputText
                                ref={firstRef}
                                value={form.title}
                                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                                placeholder="e.g. IELTS Intensive"
                                className={!form.title?.trim() ? "p-invalid" : ""}
                            />
                        </div>

                        <div className="frm-field">
                            <label>Status</label>
                            <Dropdown
                                value={form.isActive}
                                options={statusOpts}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setForm((s) => ({ ...s, isActive: e.value }))}
                            />
                        </div>

                        <div className="frm-field">
                            <label>Fee (VND)</label>
                            <InputNumber
                                value={form.fee}
                                onValueChange={(e) => setForm((s) => ({ ...s, fee: e.value ?? 0 }))}
                                mode="currency"
                                currency="VND"
                                locale="vi-VN"
                                min={0}
                            />
                        </div>

                        <div className="frm-field">
                            <label>Min student</label>
                            <InputNumber
                                value={form.minStudent}
                                onValueChange={(e) => setForm((s) => ({ ...s, minStudent: e.value ?? 1 }))}
                                showButtons
                                min={1}
                            />
                        </div>

                        <div className="frm-field">
                            <label>Max student</label>
                            <InputNumber
                                value={form.maxStudent}
                                onValueChange={(e) => setForm((s) => ({ ...s, maxStudent: e.value ?? 1 }))}
                                showButtons
                                min={1}
                                className={(form.maxStudent ?? 0) < (form.minStudent ?? 1) ? "p-invalid" : ""}
                            />
                            {(form.maxStudent ?? 0) < (form.minStudent ?? 1) && (
                                <div className="error">Max must be ≥ Min</div>
                            )}
                        </div>

                        <div className="frm-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Description</label>
                            <InputText
                                value={form.description}
                                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                                placeholder="Optional"
                            />
                        </div>

                        <div className="frm-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Image URL</label>
                            <InputText
                                value={form.imageUrl}
                                onChange={(e) => setForm((s) => ({ ...s, imageUrl: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </section>
            </div>

            <div className="dlg-footer">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    disabled={!canSave}
                    onClick={() =>
                        onSave?.({
                            title: form.title.trim(),
                            minStudent: form.minStudent,
                            maxStudent: form.maxStudent,
                            fee: form.fee,
                            description: form.description?.trim() || null,
                            imageUrl: form.imageUrl?.trim() || null,
                            isActive: form.isActive,
                        })
                    }
                />
            </div>
        </Dialog>
    );
}
