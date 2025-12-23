import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";

export default function CreateSubjectDialog({ visible, onClose, onSave }) {
    const [form, setForm] = useState({
        title: "",
        code: "",
        sessionNumber: null,
        fee: null,
        minStudent: null,
        maxStudent: null,
        description: "",
        isActive: true,
    });

    const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = () => {
        onSave?.({
            title: form.title.trim(),
            code: form.code.trim(),
            sessionNumber: form.sessionNumber,
            fee: form.fee,
            minStudent: form.minStudent,
            maxStudent: form.maxStudent,
            description: form.description,
            isActive: form.isActive,
        });
    };

    return (
        <Dialog
            header="Create Subject"
            visible={visible}
            onHide={onClose}
            modal
            draggable={false}
            style={{ width: "520px" }}
        >
            <div className="p-fluid" style={{ display: "grid", gap: 14 }}>

                {/* ===== BASIC INFO ===== */}
                <div>
                    <label className="p-text-bold">Subject title *</label>
                    <InputText
                        value={form.title}
                        onChange={(e) => update("title", e.target.value)}
                        placeholder="e.g. IELTS Writing Foundation"
                    />
                </div>

                <div>
                    <label className="p-text-bold">Subject code *</label>
                    <InputText
                        value={form.code}
                        onChange={(e) => update("code", e.target.value)}
                        placeholder="e.g. SUBJ-IELTS-WRITING"
                    />
                </div>

                <Divider />

                {/* ===== LEARNING SETUP ===== */}
                <div>
                    <label className="p-text-bold">Number of sessions</label>
                    <InputNumber
                        value={form.sessionNumber}
                        onValueChange={(e) => update("sessionNumber", e.value)}
                        placeholder="Total sessions (e.g. 20)"
                        min={1}
                        showButtons
                    />
                </div>

                <div>
                    <label className="p-text-bold">Fee (VND)</label>
                    <InputNumber
                        value={form.fee}
                        onValueChange={(e) => update("fee", e.value)}
                        mode="currency"
                        currency="VND"
                        locale="vi-VN"
                        placeholder="Total tuition fee"
                    />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                        <label className="p-text-bold">Min students</label>
                        <InputNumber
                            value={form.minStudent}
                            onValueChange={(e) => update("minStudent", e.value)}
                            placeholder="Minimum"
                            min={1}
                        />
                    </div>
                    <div>
                        <label className="p-text-bold">Max students</label>
                        <InputNumber
                            value={form.maxStudent}
                            onValueChange={(e) => update("maxStudent", e.value)}
                            placeholder="Maximum"
                            min={1}
                        />
                    </div>
                </div>

                <Divider />

                {/* ===== DESCRIPTION ===== */}
                <div>
                    <label className="p-text-bold">Description</label>
                    <InputTextarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={3}
                        placeholder="Short description of subject content"
                    />
                </div>

                {/* ===== STATUS ===== */}
                <div>
                    <label className="p-text-bold">Status</label>
                    <Dropdown
                        value={form.isActive}
                        options={[
                            { label: "Active", value: true },
                            { label: "Inactive", value: false },
                        ]}
                        onChange={(e) => update("isActive", e.value)}
                    />
                </div>

                {/* ===== ACTIONS ===== */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <Button label="Cancel" text onClick={onClose} />
                    <Button label="Create subject" onClick={handleSubmit} />
                </div>
            </div>
        </Dialog>
    );
}
