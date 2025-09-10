import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export default function CreateEventDialog({ visible, onHide, onCreate, typeOptions }) {
    const [form, setForm] = useState({ title: '', start: '', end: '', teacher: '', room: '', type: '' });

    const handleCreate = async () => {
        if (!form.title || !form.start || !form.end) {
            return;
        }
        await onCreate({
            title: form.title,
            start: form.start,
            end: form.end,
            teacher: form.teacher,
            room: form.room,
            type: form.type,
        });
        setForm({ title: '', start: '', end: '', teacher: '', room: '', type: '' });
        onHide();
    };

    return (
        <Dialog header="Tạo sự kiện mới" visible={visible} style={{ width: '520px' }} footer={
            <div>
                <Button label="Huỷ" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Tạo" icon="pi pi-plus" onClick={handleCreate} />
            </div>
        } onHide={onHide}>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12">
                    <label>Tiêu đề</label>
                    <InputText value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
                </div>
                <div className="p-field p-col-6">
                    <label>Ngày giờ bắt đầu (ISO)</label>
                    <InputText placeholder="2025-09-08T08:30:00" value={form.start} onChange={(e) => setForm((s) => ({ ...s, start: e.target.value }))} />
                </div>
                <div className="p-field p-col-6">
                    <label>Ngày giờ kết thúc (ISO)</label>
                    <InputText placeholder="2025-09-08T10:00:00" value={form.end} onChange={(e) => setForm((s) => ({ ...s, end: e.target.value }))} />
                </div>
                <div className="p-field p-col-6">
                    <label>Giáo viên</label>
                    <InputText value={form.teacher} onChange={(e) => setForm((s) => ({ ...s, teacher: e.target.value }))} />
                </div>
                <div className="p-field p-col-6">
                    <label>Phòng</label>
                    <InputText value={form.room} onChange={(e) => setForm((s) => ({ ...s, room: e.target.value }))} />
                </div>
                <div className="p-field p-col-12">
                    <label>Loại</label>
                    <Dropdown value={form.type} options={typeOptions} onChange={(e) => setForm((s) => ({ ...s, type: e.value }))} placeholder="Chọn loại" />
                </div>
            </div>
        </Dialog>
    );
}
