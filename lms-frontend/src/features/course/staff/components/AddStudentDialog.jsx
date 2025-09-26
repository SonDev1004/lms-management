import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { emailValid, phoneLooksValid } from '../lib/validators';
import '../styles/Index.css';

export default function AddStudentDialog({
                                             visible, onClose, onSave, classOptions, courseOptions, defaultValues = {}
                                         }) {
    const [form, setForm] = useState({
        name: '', email: '', phone: '',
        class: 'Class A', course: 'English - Pre A1',
        score: 0, status: 'active', ...defaultValues,
    });
    const [errors, setErrors] = useState({});
    const nameRef = useRef(null);

    useEffect(() => { if (visible) setTimeout(() => nameRef.current?.focus(), 50); }, [visible]);
    useEffect(() => { if (!visible) setErrors({}); }, [visible]);

    const setField = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };
    const canSave = useMemo(() =>
        form.name?.trim() && emailValid(form.email) &&
        typeof form.score === 'number' && form.score >= 0 && form.score <= 100, [form]);

    function validate() {
        const e = {};
        if (!form.name?.trim()) e.name = 'Name is required';
        if (!form.email?.trim()) e.email = 'Email is required';
        else if (!emailValid(form.email)) e.email = 'Email is invalid';
        if (form.score == null || Number.isNaN(form.score)) e.score = 'Score is required';
        else if (form.score < 0 || form.score > 100) e.score = 'Score must be 0–100';
        if (form.phone && !phoneLooksValid(form.phone)) e.phone = 'Phone looks invalid';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSave() {
        if (!validate()) return;
        onSave({
            ...form,
            name: form.name.trim().replace(/\s+/g, ' '),
            email: form.email.trim().toLowerCase(),
            phone: form.phone?.trim(),
        });
    }

    return (
        <Dialog
            header="Add Student"
            visible={visible}
            style={{ width: '640px', maxWidth: '96vw' }}
            modal
            onHide={onClose}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
        >
            <div className="form-grid-2">
                <div className="field">
                    <label htmlFor="name">Name <span className="req">*</span></label>
                    <InputText id="name" ref={nameRef} value={form.name}
                               onChange={(e) => setField('name', e.target.value)}
                               placeholder="e.g., Alice Johnson" className={errors.name ? 'p-invalid' : undefined}/>
                    {errors.name && <small className="p-error field-error">{errors.name}</small>}
                </div>
                <div className="field">
                    <label htmlFor="email">Email <span className="req">*</span></label>
                    <InputText id="email" value={form.email}
                               onChange={(e) => setField('email', e.target.value)}
                               placeholder="alice@example.com" className={errors.email ? 'p-invalid' : undefined}/>
                    {errors.email && <small className="p-error field-error">{errors.email}</small>}
                </div>

                <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <InputText id="phone" value={form.phone}
                               onChange={(e) => setField('phone', e.target.value)}
                               placeholder="+1 555 123 4567"/>
                    <small className="hint">Optional • used for contact</small>
                    {errors.phone && <small className="p-error field-error">{errors.phone}</small>}
                </div>
                <div className="field">
                    <label htmlFor="score">Score <span className="req">*</span></label>
                    <div className="inline-input">
                        <InputNumber id="score" value={form.score}
                                     onValueChange={(e) => setField('score', e.value)}
                                     showButtons min={0} max={100} suffix="%"
                                     className={errors.score ? 'p-invalid w-full' : 'w-full'}
                                     onWheel={(e) => e.currentTarget.querySelector('input')?.blur()}/>
                    </div>
                    {errors.score && <small className="p-error field-error">{errors.score}</small>}
                    <small className="hint">0–100%</small>
                </div>

                <div className="field">
                    <label>Class</label>
                    <Dropdown value={form.class}
                              options={classOptions.slice(1)} optionLabel="label" optionValue="value"
                              onChange={(e) => setField('class', e.value)} />
                </div>
                <div className="field">
                    <label>Course</label>
                    <Dropdown value={form.course}
                              options={courseOptions.slice(1)} optionLabel="label" optionValue="value"
                              onChange={(e) => setField('course', e.value)} />
                </div>
                <div className="field">
                    <label>Status</label>
                    <Dropdown value={form.status}
                              options={[{ label: 'active', value: 'active' }, { label: 'inactive', value: 'inactive' }]}
                              optionLabel="label" optionValue="value"
                              onChange={(e) => setField('status', e.value)} />
                </div>
            </div>

            <div className="dialog-actions">
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={onClose} />
                <Button label="Save" icon="pi pi-check" className="p-button-primary" disabled={!canSave} onClick={handleSave} />
            </div>
        </Dialog>
    );
}

AddStudentDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    classOptions: PropTypes.array.isRequired,
    courseOptions: PropTypes.array.isRequired,
    defaultValues: PropTypes.object,
};

