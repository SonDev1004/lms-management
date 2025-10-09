import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import '../styles/Index.css';
import '../styles/AddCourseDialog.css';

export default function AddCourseDialog({
                                            visible,
                                            onClose,
                                            onSave,
                                            classOptions = [
                                                { label: 'Class A', value: 'Class A' },
                                                { label: 'Class B', value: 'Class B' },
                                                { label: 'Class C', value: 'Class C' },
                                            ],
                                            statusOptions = [
                                                { label: 'active', value: 'active' },
                                                { label: 'inactive', value: 'inactive' },
                                            ],
                                            defaultValues = {},
                                        }) {
    const [form, setForm] = useState({
        title: '',
        teacher: '',
        class: classOptions?.[0]?.value ?? 'Class A',
        status: 'active',
        startDate: null,
        endDate: null,
        capacity: 20,
        enrolled: 0,
        ...defaultValues,
    });
    const [errors, setErrors] = useState({});
    const nameRef = useRef(null);

    // autofocus & reset errors when reopen
    useEffect(() => { if (visible) setTimeout(() => nameRef.current?.focus(), 50); }, [visible]);
    useEffect(() => { if (!visible) setErrors({}); }, [visible]);

    const setField = (k, v) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrors(e => ({ ...e, [k]: undefined }));
    };

    const canSave = useMemo(() => {
        const okTitle = !!form.title?.trim();
        const okTeacher = !!form.teacher?.trim();
        const okCap = typeof form.capacity === 'number' && form.capacity >= 0;
        const okEnr = typeof form.enrolled === 'number' && form.enrolled >= 0;
        const okDate =
            !form.startDate || !form.endDate ||
            (new Date(form.startDate).getTime() <= new Date(form.endDate).getTime());
        return okTitle && okTeacher && okCap && okEnr && okDate;
    }, [form]);

    function validate() {
        const e = {};
        if (!form.title?.trim()) e.title = 'Course name is required';
        if (!form.teacher?.trim()) e.teacher = 'Teacher is required';
        if (form.capacity == null || Number.isNaN(form.capacity) || form.capacity < 0) e.capacity = 'Capacity must be ≥ 0';
        if (form.enrolled == null || Number.isNaN(form.enrolled) || form.enrolled < 0) e.enrolled = 'Enrolled must be ≥ 0';
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
        onSave?.(payload);
    }

    return (
        <Dialog
            className="add-course-dialog"
            header="Add Course"
            visible={visible}
            modal
            style={{ width: '720px', maxWidth: '96vw' }}
            onHide={onClose}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); }
            }}
        >
            <div className="grid-2">
                {/* Course name (full) */}
                <div className="field col-span-2">
                    <label htmlFor="course-name">Course name <span className="req">*</span></label>
                    <InputText
                        id="course-name"
                        ref={nameRef}
                        value={form.title}
                        onChange={(e) => setField('title', e.target.value)}
                        placeholder="e.g., English - A1"
                        className={errors.title ? 'p-invalid w-full' : 'w-full'}
                    />
                    {errors.title && <small className="p-error field-error">{errors.title}</small>}
                </div>

                {/* Teacher (full) */}
                <div className="field col-span-2">
                    <label htmlFor="teacher">Teacher <span className="req">*</span></label>
                    <InputText
                        id="teacher"
                        value={form.teacher}
                        onChange={(e) => setField('teacher', e.target.value)}
                        placeholder="e.g., John Smith"
                        className={errors.teacher ? 'p-invalid w-full' : 'w-full'}
                    />
                    {errors.teacher && <small className="p-error field-error">{errors.teacher}</small>}
                </div>

                {/* Class */}
                <div className="field">
                    <label>Class</label>
                    <Dropdown
                        value={form.class}
                        options={classOptions}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setField('class', e.value)}
                    />
                </div>

                {/* Status */}
                <div className="field">
                    <label>Status</label>
                    <Dropdown
                        value={form.status}
                        options={statusOptions}
                        optionLabel="label"
                        optionValue="value"
                        onChange={(e) => setField('status', e.value)}
                    />
                </div>

                {/* Start date */}
                <div className="field">
                    <label htmlFor="start-date">Start date</label>
                    <Calendar
                        id="start-date"
                        value={form.startDate ? new Date(form.startDate) : form.startDate}
                        onChange={(e) => setField('startDate', e.value)}
                        dateFormat="yy-mm-dd"
                        showIcon
                        placeholder="YYYY-MM-DD"
                    />
                    <small className="hint">Format: YYYY-MM-DD</small>
                </div>

                {/* End date */}
                <div className="field">
                    <label htmlFor="end-date">End date</label>
                    <Calendar
                        id="end-date"
                        value={form.endDate ? new Date(form.endDate) : form.endDate}
                        onChange={(e) => setField('endDate', e.value)}
                        dateFormat="yy-mm-dd"
                        showIcon
                        placeholder="YYYY-MM-DD"
                        className={errors.endDate ? 'p-invalid' : undefined}
                    />
                    {errors.endDate && <small className="p-error field-error">{errors.endDate}</small>}
                    <small className="hint">Format: YYYY-MM-DD</small>
                </div>

                {/* Capacity */}
                <div className="field">
                    <label htmlFor="capacity">Capacity</label>
                    <InputNumber
                        id="capacity"
                        value={form.capacity}
                        onValueChange={(e) => setField('capacity', e.value)}
                        showButtons
                        min={0}
                        step={1}
                        className={errors.capacity ? 'p-invalid w-full' : 'w-full'}
                        onWheel={(e) => e.currentTarget.querySelector('input')?.blur()}
                    />
                    {errors.capacity && <small className="p-error field-error">{errors.capacity}</small>}
                </div>

                {/* Enrolled */}
                <div className="field">
                    <label htmlFor="enrolled">Enrolled</label>
                    <InputNumber
                        id="enrolled"
                        value={form.enrolled}
                        onValueChange={(e) => setField('enrolled', e.value)}
                        showButtons
                        min={0}
                        step={1}
                        className={errors.enrolled ? 'p-invalid w-full' : 'w-full'}
                        onWheel={(e) => e.currentTarget.querySelector('input')?.blur()}
                    />
                    {errors.enrolled && <small className="p-error field-error">{errors.enrolled}</small>}
                </div>
            </div>

            <div className="dialog-actions">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                <Button label="Save" icon="pi pi-check" className="p-button-primary" disabled={!canSave} onClick={handleSave} />
            </div>
        </Dialog>
    );
}

AddCourseDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    classOptions: PropTypes.array,
    statusOptions: PropTypes.array,
    defaultValues: PropTypes.object,
};
