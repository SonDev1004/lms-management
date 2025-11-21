import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import "../styles/dialog-forms.css";        // dùng chung style .dlg
import "../styles/ProgramDetailDialog.css"; // style riêng của detail

export default function ProgramDetailDialog({
                                                visible,
                                                onClose,
                                                program,
                                                categoryOptions = [
                                                    { label: "Adults", value: "Adults" },
                                                    { label: "Kids & Teens", value: "Kids & Teens" },
                                                    { label: "Exam Prep", value: "Exam Prep" },
                                                ],
                                                levelOptions = [
                                                    { label: "Pre A1–A1", value: "Pre A1–A1" },
                                                    { label: "A1–A2", value: "A1–A2" },
                                                    { label: "A2–B1", value: "A2–B1" },
                                                    { label: "B1–B2", value: "B1–B2" },
                                                    { label: "B2–C1", value: "B2–C1" },
                                                ],
                                                statusOptions = [
                                                    { label: "active", value: "active" },
                                                    { label: "inactive", value: "inactive" },
                                                ],
                                                onUpdate,
                                                onDelete,
                                            }) {
    const [mode, setMode] = useState("view"); // 'view' | 'edit'
    const [form, setForm] = useState(program ?? {});
    const [errors, setErrors] = useState({});
    const nameRef = useRef(null);

    // Khi mở dialog hoặc đổi program -> reset state
    useEffect(() => {
        if (visible) {
            setMode("view");
            setForm(program ?? {});
            setErrors({});
        }
    }, [visible, program]);

    useEffect(() => {
        if (mode === "edit") {
            const t = setTimeout(() => nameRef.current?.focus(), 40);
            return () => clearTimeout(t);
        }
    }, [mode]);

    const setField = (k, v) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((e) => ({ ...e, [k]: undefined }));
    };

    const canSave = useMemo(() => {
        if (mode !== "edit") return false;
        const okName = !!form.name?.trim();
        const okNums =
            (form.durationWeeks ?? 0) >= 0 &&
            (form.fee ?? 0) >= 0 &&
            (form.totalCourses ?? 0) >= 0 &&
            (form.activeCourses ?? 0) >= 0 &&
            (form.activeCourses ?? 0) <= (form.totalCourses ?? 0);
        return okName && okNums;
    }, [mode, form]);

    function validate() {
        const e = {};
        if (!form.name?.trim()) e.name = "Program name is required";
        if ((form.activeCourses ?? 0) > (form.totalCourses ?? 0)) {
            e.activeCourses = "Active courses must be ≤ Total courses";
        }
        if ((form.durationWeeks ?? 0) < 0) e.durationWeeks = "Duration must be ≥ 0";
        if ((form.fee ?? 0) < 0) e.fee = "Tuition must be ≥ 0";
        if ((form.totalCourses ?? 0) < 0) e.totalCourses = "Total courses must be ≥ 0";
        if ((form.activeCourses ?? 0) < 0) e.activeCourses = "Active courses must be ≥ 0";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSave() {
        if (!validate()) return;
        const payload = {
            ...form,
            name: form.name.trim().replace(/\s+/g, " "),
            updatedAt: new Date().toISOString().slice(0, 10),
        };
        onUpdate?.(payload);
        setMode("view");
    }

    function handleDelete() {
        confirmDialog({
            message: `Delete program “${program?.name}”?`,
            header: "Confirm Delete",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Delete",
            rejectLabel: "Cancel",
            acceptClassName: "p-button-danger",
            accept: () => {
                onDelete?.(program?.id);
                onClose?.();
            },
        });
    }

    const headerTitle = form?.name || program?.name || "Program detail";
    const headerStatus = form?.status || program?.status || "inactive";
    const headerId = form?.id || program?.id;

    return (
        <>
            <ConfirmDialog />

            <Dialog
                className="dlg program-detail-dialog"
                visible={visible}
                onHide={onClose}
                modal
                style={{ width: "860px", maxWidth: "96vw" }}
                header={
                    <div className="pd-header">
                        <div className="pd-title">
                            <div className="title">{headerTitle}</div>
                            <div className="sub">
                                <Tag
                                    value={headerStatus}
                                    severity={headerStatus === "active" ? "success" : "warning"}
                                />
                                {headerId && (
                                    <>
                                        <span className="sep">•</span>
                                        <span>{headerId}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="dlg-scroll pd-content">
                    {/* summary strip */}
                    <div className="pd-stats">
                        <div className="stat">
                            <div className="sm-muted">Category</div>
                            <div className="big">{form.category || "-"}</div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Level (CEFR)</div>
                            <div className="big">{form.level || "-"}</div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Duration</div>
                            <div className="big">
                                {form.durationWeeks ?? "-"} wks
                            </div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Tuition</div>
                            <div className="big">
                                {(form.fee ?? 0).toLocaleString("vi-VN")}₫
                            </div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Courses</div>
                            <div className="big">
                                {form.activeCourses ?? 0}/{form.totalCourses ?? 0}
                            </div>
                        </div>
                    </div>

                    {/* form */}
                    <div className={`pd-form ${mode === "view" ? "is-view" : "is-edit"}`}>
                        <div className="field col-span-2">
                            <label>
                                Program name <span className="req">*</span>
                            </label>
                            <InputText
                                ref={nameRef}
                                value={form.name || ""}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="e.g., General English"
                                disabled={mode === "view"}
                                className={errors.name ? "p-invalid w-full" : "w-full"}
                            />
                            {errors.name && (
                                <small className="p-error field-error">{errors.name}</small>
                            )}
                        </div>

                        <div className="field">
                            <label>Category</label>
                            <Dropdown
                                value={form.category || categoryOptions?.[0]?.value}
                                options={categoryOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setField("category", e.value)}
                                disabled={mode === "view"}
                            />
                        </div>

                        <div className="field">
                            <label>Status</label>
                            <Dropdown
                                value={form.status || "active"}
                                options={statusOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setField("status", e.value)}
                                disabled={mode === "view"}
                            />
                        </div>

                        <div className="field">
                            <label>Level (CEFR)</label>
                            <Dropdown
                                value={form.level || levelOptions?.[0]?.value}
                                options={levelOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setField("level", e.value)}
                                disabled={mode === "view"}
                            />
                        </div>

                        <div className="field">
                            <label>Duration (weeks)</label>
                            <InputNumber
                                value={form.durationWeeks ?? 0}
                                onValueChange={(e) => setField("durationWeeks", e.value)}
                                showButtons
                                min={0}
                                disabled={mode === "view"}
                                className={errors.durationWeeks ? "p-invalid w-full" : "w-full"}
                            />
                            {errors.durationWeeks && (
                                <small className="p-error field-error">
                                    {errors.durationWeeks}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label>Tuition (VND)</label>
                            <InputNumber
                                value={form.fee ?? 0}
                                onValueChange={(e) => setField("fee", e.value)}
                                mode="currency"
                                currency="VND"
                                locale="vi-VN"
                                disabled={mode === "view"}
                                className={errors.fee ? "p-invalid w-full" : "w-full"}
                            />
                            {errors.fee && (
                                <small className="p-error field-error">{errors.fee}</small>
                            )}
                        </div>

                        <div className="field">
                            <label>Total courses</label>
                            <InputNumber
                                value={form.totalCourses ?? 0}
                                onValueChange={(e) => setField("totalCourses", e.value)}
                                showButtons
                                min={0}
                                disabled={mode === "view"}
                                className={errors.totalCourses ? "p-invalid w-full" : "w-full"}
                            />
                            {errors.totalCourses && (
                                <small className="p-error field-error">
                                    {errors.totalCourses}
                                </small>
                            )}
                        </div>

                        <div className="field">
                            <label>Active courses</label>
                            <InputNumber
                                value={form.activeCourses ?? 0}
                                onValueChange={(e) => setField("activeCourses", e.value)}
                                showButtons
                                min={0}
                                disabled={mode === "view"}
                                className={errors.activeCourses ? "p-invalid w-full" : "w-full"}
                            />
                            {errors.activeCourses && (
                                <small className="p-error field-error">
                                    {errors.activeCourses}
                                </small>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS – phía sau form */}
                    <div className="pd-footer-actions">
                        {mode === "view" ? (
                            <>
                                <div className="grow" />
                                <Button
                                    label="Edit"
                                    icon="pi pi-pencil"
                                    onClick={() => setMode("edit")}
                                />
                                <Button
                                    label="Delete"
                                    icon="pi pi-trash"
                                    className="p-button-danger"
                                    onClick={handleDelete}
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    label="Cancel"
                                    className="p-button-text"
                                    onClick={() => {
                                        setForm(program ?? {});
                                        setErrors({});
                                        setMode("view");
                                    }}
                                />
                                <Button
                                    label="Save"
                                    icon="pi pi-check"
                                    disabled={!canSave}
                                    onClick={handleSave}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
}

ProgramDetailDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    program: PropTypes.object,
    categoryOptions: PropTypes.array,
    levelOptions: PropTypes.array,
    statusOptions: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
