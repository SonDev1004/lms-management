import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { classes, courses, studentStatusOptions } from '../mocks/students';

const empty = { id:'', name:'', email:'', phone:'', class:classes[0].value, status:'active', gpa:3.2, courses:['CS101'] };

export default function AddStudentDialog({ visible, onHide, defaultValues, onSave }) {
    const [form, setForm] = useState(defaultValues || empty);
    useEffect(() => setForm(defaultValues || empty), [defaultValues, visible]);

    const footer = (
        <div className="flex justify-content-end gap-2">
            <Button label="Cancel" text onClick={onHide} />
            <Button label="Save" icon="pi pi-check" onClick={() => onSave(form)} />
        </div>
    );

    return (
        <Dialog header={defaultValues ? 'Edit Student' : 'Add Student'} visible={visible} style={{width:'36rem'}} onHide={onHide} footer={footer} draggable={false} blockScroll>
            <div className="formgrid grid">
                <div className="field col-12 md:col-6">
                    <FloatLabel>
                        <InputText id="id" value={form.id} onChange={e=>setForm({...form, id:e.target.value})} />
                        <label htmlFor="id">Student ID</label>
                    </FloatLabel>
                </div>
                <div className="field col-12 md:col-6">
                    <FloatLabel>
                        <InputNumber id="gpa" mode="decimal" minFractionDigits={2} maxFractionDigits={2} value={form.gpa} onValueChange={e=>setForm({...form, gpa:e.value})} />
                        <label htmlFor="gpa">GPA</label>
                    </FloatLabel>
                </div>
                <div className="field col-12">
                    <FloatLabel>
                        <InputText id="name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
                        <label htmlFor="name">Full name</label>
                    </FloatLabel>
                </div>
                <div className="field col-12 md:col-6">
                    <FloatLabel>
                        <InputText id="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                </div>
                <div className="field col-12 md:col-6">
                    <FloatLabel>
                        <InputText id="phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
                        <label htmlFor="phone">Phone</label>
                    </FloatLabel>
                </div>
                <div className="field col-12 md:col-6">
                    <Dropdown className="w-full" value={form.class} onChange={e=>setForm({...form, class:e.value})} options={classes} placeholder="Class" />
                </div>
                <div className="field col-12 md:col-6">
                    <Dropdown className="w-full" value={form.status} onChange={e=>setForm({...form, status:e.value})} options={studentStatusOptions} optionLabel="label" optionValue="value" placeholder="Status" />
                </div>
                <div className="field col-12">
                    <Dropdown className="w-full" value={form.courses} onChange={e=>setForm({...form, courses:e.value})} options={courses} optionLabel="code" optionValue="code" placeholder="Courses" multiple filter />
                </div>
            </div>
        </Dialog>
    );
}
