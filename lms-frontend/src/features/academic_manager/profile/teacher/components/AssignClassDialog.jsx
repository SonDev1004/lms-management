import { useEffect, useMemo, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function AssignClassDialog({ open, onClose, onSave, subjects = [], campuses = ['Main','City'] }) {
    const [form, setForm] = useState({});
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (open) {
            setForm({ term: 'Fall 2024', students: 30, campus: campuses?.[0] || '' });
            setTouched(false);
        }
    }, [open]); // eslint-disable-line

    const set = (k, v) => { setForm(s => ({ ...s, [k]: v })); setTouched(true); };

    const subjectOpts = useMemo(() =>
        subjects.map(s => ({ label: `${s.code} — ${s.name}`, value: s.code })), [subjects]
    );

    const schedule = useMemo(() => {
        if (!form.day || !form.start || !form.end || !form.room) return form.schedule || '';
        const fmt = d => d?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return `${form.day} ${fmt(form.start)}–${fmt(form.end)} | ${form.room}`;
    }, [form.day, form.start, form.end, form.room, form.schedule]);

    const canSave =
        form.subject && (form.course?.trim()?.length > 1) &&
        (schedule?.trim()?.length > 6) && form.campus && form.term &&
        Number.isFinite(form.students) && form.students >= 0;

    const footer = (
        <div className="flex gap-2 justify-end">
            <Button label="Cancel" outlined onClick={onClose} />
            <Button label="Assign" icon="pi pi-check" disabled={!canSave}
                    onClick={() => onSave({ ...form, schedule })} />
        </div>
    );

    const onEnterSubmit = (e) => {
        if (e.key === 'Enter' && canSave) onSave({ ...form, schedule });
    };

    return (
        <Dialog header="Assign Class" visible={open} onHide={onClose} footer={footer}
                style={{ width: 680 }} blockScroll onKeyDown={onEnterSubmit}>
            <div className="grid formgrid p-fluid">
                <div className="field col-12">
                    <label>Subject</label>
                    <Dropdown value={form.subject} options={subjectOpts}
                              onChange={(e)=>set('subject', e.value)} placeholder="Select subject" filter />
                </div>

                <div className="field col-12">
                    <label>Course<span className="req">*</span></label>
                    <InputText value={form.course || ''} onChange={(e)=>set('course', e.target.value)} placeholder="e.g., Calculus I" />
                </div>

                <div className="field col-6 md:col-4">
                    <label>Term</label>
                    <InputText value={form.term || ''} onChange={(e)=>set('term', e.target.value)} />
                </div>

                <div className="field col-6 md:col-4">
                    <label>Students</label>
                    <InputNumber value={form.students ?? 0} onValueChange={(e)=>set('students', e.value)} min={0} />
                </div>

                <div className="field col-12">
                    <div className="text-sm muted mb-2">Schedule</div>
                    <div className="grid">
                        <div className="col-12 md:col-3">
                            <Dropdown value={form.day} options={DAYS.map(d=>({label:d,value:d}))} onChange={(e)=>set('day', e.value)} placeholder="Day" />
                        </div>
                        <div className="col-6 md:col-3">
                            <Calendar timeOnly hourFormat="24" value={form.start || null} onChange={(e)=>set('start', e.value)} placeholder="Start" />
                        </div>
                        <div className="col-6 md:col-3">
                            <Calendar timeOnly hourFormat="24" value={form.end || null} onChange={(e)=>set('end', e.value)} placeholder="End" />
                        </div>
                        <div className="col-12 md:col-3">
                            <InputText value={form.room || ''} onChange={(e)=>set('room', e.target.value)} placeholder="Room (e.g., R201)" />
                        </div>
                    </div>
                    <div className="text-xs muted mt-1">Preview: <strong>{schedule || '—'}</strong></div>
                </div>

                <div className="field col-12 md:col-6">
                    <label>Campus</label>
                    <Dropdown value={form.campus} options={(campuses||[]).map(c=>({label:c, value:c}))}
                              onChange={(e)=>set('campus', e.value)} placeholder="Select campus" />
                </div>
            </div>

            {!canSave && touched && (
                <div className="tp-form-hint mt-2">Điền đủ Subject, Course, Schedule, Campus để bật nút Assign.</div>
            )}
        </Dialog>
    );
}
