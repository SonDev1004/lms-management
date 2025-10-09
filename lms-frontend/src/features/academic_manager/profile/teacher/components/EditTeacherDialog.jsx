import React, { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import '../styles/EditTeacherDialog.css';

const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'On Leave', value: 'leave' },
    { label: 'Inactive', value: 'inactive' },
];

const employmentTypes = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Contract', value: 'Contract' },
];

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
const isPhone = (v) => /^[\d\s+()-]{6,}$/.test(v || '');

export default function EditTeacherDialog({ open, onClose, value, onSave }) {
    const [form, setForm] = useState(value || {});
    useEffect(() => setForm(value || {}), [value]);

    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

    const valid = useMemo(
        () => ({
            name: (form?.name || '').trim().length >= 2,
            email: isEmail(form?.email),
            phone: !form?.phone || isPhone(form?.phone),
        }),
        [form]
    );

    const canSave = valid.name && valid.email;

    const footer = (
        <div className="dialog-actions">
            <Button label="Cancel" className="p-button-text" onClick={onClose} />
            <Button label="Save" icon="pi pi-check" className="p-button-primary" onClick={() => onSave(form)} disabled={!canSave} />
        </div>
    );

    const onEnter = (e) => {
        if (e.key === 'Enter' && canSave) onSave(form);
    };

    return (
        <Dialog
            header="Edit Teacher Profile"
            visible={open}
            className="edit-teacher-dialog"
            style={{ width: 760, maxWidth: '96vw' }}
            onHide={onClose}
            footer={footer}
            onKeyDown={onEnter}
            modal
            blockScroll
        >
            {/* Grid 2 cột -> 1 cột trên mobile */}
            <div className="etd-form">
                <div className="field">
                    <label>Name <span className="req">*</span></label>
                    <InputText
                        value={form.name || ''}
                        onChange={(e) => set('name', e.target.value)}
                        className={!valid.name ? 'p-invalid w-full' : 'w-full'}
                        placeholder="e.g., Jane Nguyen"
                    />
                    {!valid.name && <small className="p-error field-error">Name is required.</small>}
                </div>

                <div className="field">
                    <label>Status</label>
                    <Dropdown
                        value={form.status}
                        options={statusOptions}
                        onChange={(e) => set('status', e.value)}
                        placeholder="Select"
                        className="w-full"
                    />
                </div>

                <div className="field">
                    <label>Title</label>
                    <InputText
                        value={form.title || ''}
                        onChange={(e) => set('title', e.target.value)}
                        placeholder="Senior Lecturer – English"
                        className="w-full"
                    />
                </div>

                <div className="field">
                    <label>Hired Date</label>
                    <Calendar
                        value={form.hiredDate ? new Date(form.hiredDate) : null}
                        onChange={(e) => set('hiredDate', e.value?.toISOString().slice(0, 10))}
                        dateFormat="dd/mm/yy"
                        showIcon
                        placeholder="dd/mm/yyyy"
                        className="w-full"
                    />
                </div>

                <div className="field">
                    <label>Email <span className="req">*</span></label>
                    <InputText
                        value={form.email || ''}
                        onChange={(e) => set('email', e.target.value)}
                        className={!valid.email ? 'p-invalid w-full' : 'w-full'}
                        placeholder="name@example.com"
                    />
                    {!valid.email && <small className="p-error field-error">Email is invalid.</small>}
                </div>

                <div className="field">
                    <label>Phone</label>
                    <InputText
                        value={form.phone || ''}
                        onChange={(e) => set('phone', e.target.value)}
                        className={!valid.phone ? 'p-invalid w-full' : 'w-full'}
                        placeholder="+84 909 111 222"
                    />
                    {!valid.phone && <small className="p-error field-error">Phone looks incorrect.</small>}
                </div>

                <div className="field">
                    <label>Department</label>
                    <InputText
                        value={form.department || ''}
                        onChange={(e) => set('department', e.target.value)}
                        placeholder="IELTS / Adults / Young Learners…"
                        className="w-full"
                    />
                </div>

                <div className="field">
                    <label>Employment</label>
                    <Dropdown
                        value={form.employment}
                        options={employmentTypes}
                        onChange={(e) => set('employment', e.value)}
                        placeholder="Select"
                        className="w-full"
                    />
                </div>

                <div className="field field--full">
                    <label>Address</label>
                    <InputText
                        value={form.address || ''}
                        onChange={(e) => set('address', e.target.value)}
                        placeholder="Street, City"
                        className="w-full"
                    />
                </div>

                <div className="field">
                    <label>Emergency Contact</label>
                    <InputText
                        value={form.emergency?.name || ''}
                        onChange={(e) => set('emergency', { ...(form.emergency || {}), name: e.target.value })}
                        className="w-full"
                        placeholder="John Nguyen (Brother)"
                    />
                </div>

                <div className="field">
                    <label>Emergency Phone</label>
                    <InputText
                        value={form.emergency?.phone || ''}
                        onChange={(e) => set('emergency', { ...(form.emergency || {}), phone: e.target.value })}
                        className="w-full"
                        placeholder="+84 912 345 678"
                    />
                </div>
            </div>
        </Dialog>
    );
}
