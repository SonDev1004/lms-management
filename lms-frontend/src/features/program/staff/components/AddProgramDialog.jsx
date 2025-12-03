import React, { useMemo, useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import "../styles/dialog-forms.css";

export default function AddProgramDialog({ visible, onClose, onSave }) {
    const levelOpts = useMemo(
        () => [
            { label: "Pre A1–A1", value: "Pre A1–A1" },
            { label: "A1–A2", value: "A1–A2" },
            { label: "A2–B1", value: "A2–B1" },
            { label: "B1–B2", value: "B1–B2" },
            { label: "B2–C1", value: "B2–C1" },
        ],
        []
    );

    const statusOpts = useMemo(
        () => [
            { label: "active", value: "active" },
            { label: "inactive", value: "inactive" },
        ],
        []
    );

    const [form, setForm] = useState({
        name: "",
        level: "A2–B1",
        durationWeeks: 12,
        fee: 0,
        totalCourses: 0,
        activeCourses: 0,
        status: "active",
    });

    const firstInputRef = useRef(null);

    useEffect(() => {
        if (!visible) return;

        setForm({
            name: "",
            level: "A2–B1",
            durationWeeks: 12,
            fee: 0,
            totalCourses: 0,
            activeCourses: 0,
            status: "active",
        });

        const t = setTimeout(() => firstInputRef.current?.focus(), 20);
        return () => clearTimeout(t);
    }, [visible]);

    const canSave =
        form.name?.trim().length >= 3 &&
        form.durationWeeks >= 0 &&
        form.fee >= 0 &&
        form.totalCourses >= 0 &&
        form.activeCourses >= 0 &&
        form.activeCourses <= form.totalCourses;

    function handleSave() {
        if (!canSave) return;
        onSave?.(form);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey && canSave) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === "Escape") {
            onClose?.();
        }
    }

    return (
        <Dialog
            header="Add Program"
            visible={visible}
            modal
            className="dlg add-program-dialog"
            style={{ width: 640, maxWidth: "94vw" }}
            breakpoints={{ "1200px": "640px", "768px": "92vw" }}
            onHide={onClose}
            blockScroll
        >
            <div className="dlg-scroll" onKeyDown={handleKeyDown} tabIndex={-1}>
                {/* BASICS */}
                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Basics</h4>
                    <div className="frm-grid">
                        <div className="frm-field" style={{ gridColumn: "1 / -1" }}>
                            <label htmlFor="pg-name">
                                Program name <span className="req">*</span>
                            </label>
                            <InputText
                                id="pg-name"
                                ref={firstInputRef}
                                value={form.name}
                                onChange={(e) =>
                                    setForm((s) => ({ ...s, name: e.target.value }))
                                }
                                placeholder="e.g. IELTS Intensive (12 weeks)"
                                className={!form.name?.trim() ? "p-invalid" : ""}
                                aria-invalid={!form.name?.trim()}
                            />
                            {!form.name?.trim() && (
                                <div className="hint">Tên tối thiểu 3 ký tự.</div>
                            )}
                        </div>

                        <div className="frm-field">
                            <label htmlFor="pg-status">Status</label>
                            <Dropdown
                                inputId="pg-status"
                                value={form.status}
                                options={statusOpts}
                                onChange={(e) =>
                                    setForm((s) => ({ ...s, status: e.value }))
                                }
                            />
                        </div>

                        <div className="frm-field">
                            <label htmlFor="pg-level">Level (CEFR)</label>
                            <Dropdown
                                inputId="pg-level"
                                value={form.level}
                                options={levelOpts}
                                onChange={(e) =>
                                    setForm((s) => ({ ...s, level: e.value }))
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* DURATION & COST */}
                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Duration &amp; Cost</h4>
                    <div className="frm-grid">
                        <div className="frm-field">
                            <label htmlFor="pg-weeks">Duration (weeks)</label>
                            <InputNumber
                                inputId="pg-weeks"
                                value={form.durationWeeks}
                                onValueChange={(e) =>
                                    setForm((s) => ({
                                        ...s,
                                        durationWeeks: e.value ?? 0,
                                    }))
                                }
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
                            <label htmlFor="pg-fee">Tuition (VND)</label>
                            <InputNumber
                                inputId="pg-fee"
                                value={form.fee}
                                onValueChange={(e) =>
                                    setForm((s) => ({ ...s, fee: e.value ?? 0 }))
                                }
                                mode="currency"
                                currency="VND"
                                locale="vi-VN"
                            />
                            <div className="hint">
                                Học phí toàn khóa, chưa gồm tài liệu.
                            </div>
                        </div>
                    </div>
                </section>

                {/* COURSES */}
                <section className="dlg-sec">
                    <h4 className="dlg-sec-title">Courses</h4>
                    <div className="frm-grid">
                        <div className="frm-field">
                            <label htmlFor="pg-total">Total courses</label>
                            <InputNumber
                                inputId="pg-total"
                                value={form.totalCourses}
                                onValueChange={(e) =>
                                    setForm((s) => ({
                                        ...s,
                                        totalCourses: e.value ?? 0,
                                    }))
                                }
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
                            <label htmlFor="pg-active">Active courses</label>
                            <InputNumber
                                inputId="pg-active"
                                value={form.activeCourses}
                                onValueChange={(e) =>
                                    setForm((s) => ({
                                        ...s,
                                        activeCourses: e.value ?? 0,
                                    }))
                                }
                                showButtons
                                buttonLayout="vertical"
                                incrementButtonIcon="pi pi-chevron-up"
                                decrementButtonIcon="pi pi-chevron-down"
                                incrementButtonClassName="apd-step"
                                decrementButtonClassName="apd-step"
                                min={0}
                                className={
                                    form.activeCourses > form.totalCourses
                                        ? "p-invalid"
                                        : ""
                                }
                            />
                            {form.activeCourses > form.totalCourses && (
                                <div className="error">
                                    Active không thể lớn hơn Total.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <div className="dlg-footer">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={onClose}
                />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    onClick={handleSave}
                    disabled={!canSave}
                />
            </div>
        </Dialog>
    );
}
