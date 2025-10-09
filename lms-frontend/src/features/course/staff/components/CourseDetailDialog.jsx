import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import '../styles/CourseDetailDialog.css';

export default function CourseDetailDialog({
                                               visible,
                                               onClose,
                                               course,
                                               classOptions = [],
                                               statusOptions = [
                                                   { label: 'active', value: 'active' },
                                                   { label: 'inactive', value: 'inactive' },
                                               ],
                                               onUpdate,
                                               onDelete,
                                           }) {
    const [mode, setMode] = useState('view'); // 'view' | 'edit'
    const [form, setForm] = useState(course ?? {});
    const [errors, setErrors] = useState({});
    const titleRef = useRef(null);

    useEffect(() => {
        if (visible) {
            setMode('view');
            setForm(course ?? {});
            setErrors({});
        }
    }, [visible, course]);

    useEffect(() => {
        if (mode === 'edit') setTimeout(() => titleRef.current?.focus(), 30);
    }, [mode]);

    const setField = (k, v) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((e) => ({ ...e, [k]: undefined }));
    };

    const canSave = useMemo(() => {
        if (mode !== 'edit') return false;
        const okTitle = !!form.title?.trim();
        const okTeacher = !!form.teacher?.trim();
        const okCap =
            typeof form.capacity === 'number' && Number.isFinite(form.capacity) && form.capacity >= 0;
        const okEnr =
            typeof form.enrolled === 'number' &&
            Number.isFinite(form.enrolled) &&
            form.enrolled >= 0 &&
            form.enrolled <= (form.capacity ?? Infinity);
        const okDate =
            !form.startDate ||
            !form.endDate ||
            new Date(form.startDate).getTime() <= new Date(form.endDate).getTime();
        return okTitle && okTeacher && okCap && okEnr && okDate;
    }, [mode, form]);

    function validate() {
        const e = {};
        if (!form.title?.trim()) e.title = 'Course name is required';
        if (!form.teacher?.trim()) e.teacher = 'Teacher is required';
        if (form.capacity == null || Number.isNaN(form.capacity) || form.capacity < 0)
            e.capacity = 'Capacity must be ≥ 0';
        if (form.enrolled == null || Number.isNaN(form.enrolled) || form.enrolled < 0)
            e.enrolled = 'Enrolled must be ≥ 0';
        if ((form.capacity ?? 0) < (form.enrolled ?? 0)) e.enrolled = 'Enrolled must be ≤ Capacity';
        if (form.startDate && form.endDate) {
            const s = new Date(form.startDate).getTime();
            const ed = new Date(form.endDate).getTime();
            if (s > ed) e.endDate = 'End date must be after start date';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSave() {
        if (!validate()) return;
        const payload = {
            ...form,
            title: form.title.trim().replace(/\s+/g, ' '),
            teacher: form.teacher.trim().replace(/\s+/g, ' '),
            startDate: form.startDate ? new Date(form.startDate).toISOString().slice(0, 10) : '',
            endDate: form.endDate ? new Date(form.endDate).toISOString().slice(0, 10) : '',
        };
        onUpdate?.(payload);
        setMode('view');
    }

    function handleDelete() {
        confirmDialog({
            message: `Delete course “${course?.title}”?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptClassName: 'p-button-danger',
            accept: () => {
                onDelete?.(course?.id);
                onClose?.();
            },
        });
    }

    const durationDays = useMemo(() => {
        if (!course?.startDate || !course?.endDate) return '-';
        const d = (new Date(course.endDate) - new Date(course.startDate)) / 86400000;
        return Math.max(0, Math.round(d)) + ' days';
    }, [course]);

    const Header = (
        <div className="cd-header">
            <div className="cd-title">
                <div className="title">{course?.title || 'Course Detail'}</div>
                <div className="sub">
                    <Tag
                        value={course?.status || 'inactive'}
                        severity={course?.status === 'active' ? 'success' : 'warning'}
                    />
                    <span className="sep">•</span>
                    <span className="code">{course?.id}</span>
                </div>
            </div>

            <div className="cd-actions">
                {mode === 'view' ? (
                    <>
                        <Button label="Edit" icon="pi pi-pencil" onClick={() => setMode('edit')} />
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
                                setForm(course);
                                setMode('view');
                            }}
                        />
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            className="p-button-primary"
                            disabled={!canSave}
                            onClick={handleSave}
                        />
                    </>
                )}
            </div>
        </div>
    );

    return (
        <>
            <ConfirmDialog />
            <Dialog
                className="course-detail-dialog"
                header={Header}
                visible={visible}
                modal
                draggable={false}
                style={{ width: '860px', maxWidth: '96vw' }}
                onHide={onClose}
            >
                <div className="cd-content">
                    {/* Stats row */}
                    <div className="cd-stats">
                        <div className="stat">
                            <div className="sm-muted">Teacher</div>
                            <div className="big">{course?.teacher || '-'}</div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Class</div>
                            <div className="big">{course?.class || '-'}</div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Capacity</div>
                            <div className="big">{course?.capacity ?? '-'}</div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Enrolled</div>
                            <div className="big">{course?.enrolled ?? '-'}</div>
                        </div>
                        <div className="stat">
                            <div className="sm-muted">Duration</div>
                            <div className="big">{durationDays}</div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="cd-form">
                        <div className="field col-span-2">
                            <label>
                                Course name <span className="req">*</span>
                            </label>
                            <InputText
                                ref={titleRef}
                                value={form.title || ''}
                                onChange={(e) => setField('title', e.target.value)}
                                placeholder="e.g., English - A1"
                                disabled={mode === 'view'}
                                className={errors.title ? 'p-invalid w-full' : 'w-full'}
                            />
                            {errors.title && <small className="p-error field-error">{errors.title}</small>}
                        </div>

                        <div className="field">
                            <label>
                                Teacher <span className="req">*</span>
                            </label>
                            <InputText
                                value={form.teacher || ''}
                                onChange={(e) => setField('teacher', e.target.value)}
                                placeholder="e.g., John Smith"
                                disabled={mode === 'view'}
                                className={errors.teacher ? 'p-invalid w-full' : 'w-full'}
                            />
                            {errors.teacher && <small className="p-error field-error">{errors.teacher}</small>}
                        </div>

                        <div className="field">
                            <label>Class</label>
                            <Dropdown
                                value={form.class ?? classOptions?.[0]?.value ?? null}
                                options={classOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setField('class', e.value)}
                                disabled={mode === 'view'}
                            />
                        </div>

                        <div className="field">
                            <label>Status</label>
                            <Dropdown
                                value={form.status ?? 'active'}
                                options={statusOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => setField('status', e.value)}
                                disabled={mode === 'view'}
                            />
                        </div>

                        <div className="field">
                            <label>Start date</label>
                            <Calendar
                                value={form.startDate ? new Date(form.startDate) : null}
                                onChange={(e) => setField('startDate', e.value)}
                                dateFormat="yy-mm-dd"
                                showIcon
                                placeholder="YYYY-MM-DD"
                                disabled={mode === 'view'}
                            />
                        </div>

                        <div className="field">
                            <label>End date</label>
                            <Calendar
                                value={form.endDate ? new Date(form.endDate) : null}
                                onChange={(e) => setField('endDate', e.value)}
                                dateFormat="yy-mm-dd"
                                showIcon
                                placeholder="YYYY-MM-DD"
                                disabled={mode === 'view'}
                                className={errors.endDate ? 'p-invalid' : undefined}
                            />
                            {errors.endDate && <small className="p-error field-error">{errors.endDate}</small>}
                        </div>

                        <div className="field">
                            <label>Capacity</label>
                            <InputNumber
                                value={form.capacity ?? 0}
                                onValueChange={(e) => setField('capacity', e.value)}
                                showButtons
                                min={0}
                                step={1}
                                disabled={mode === 'view'}
                                className={errors.capacity ? 'p-invalid w-full' : 'w-full'}
                            />
                            {errors.capacity && (
                                <small className="p-error field-error">{errors.capacity}</small>
                            )}
                        </div>

                        <div className="field">
                            <label>Enrolled</label>
                            <InputNumber
                                value={form.enrolled ?? 0}
                                onValueChange={(e) => setField('enrolled', e.value)}
                                showButtons
                                min={0}
                                step={1}
                                disabled={mode === 'view'}
                                className={errors.enrolled ? 'p-invalid w-full' : 'w-full'}
                            />
                            {errors.enrolled && (
                                <small className="p-error field-error">{errors.enrolled}</small>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

CourseDetailDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    course: PropTypes.object,
    classOptions: PropTypes.array,
    statusOptions: PropTypes.array,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
