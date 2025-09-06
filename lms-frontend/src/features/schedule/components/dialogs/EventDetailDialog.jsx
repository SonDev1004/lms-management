// components/dialogs/EventDetailDialog.jsx
import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { formatEventTime } from '../../utils/date';

export default function EventDetailDialog({ event, visible, onHide, onDelete }) {
    return (
        <Dialog header={event ? event.title : ''} visible={visible} style={{ width: '420px' }} footer={
            <div>
                <Button label="Huỷ" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                <Button label="Xoá" icon="pi pi-trash" onClick={() => onDelete(event)} className="p-button-danger" />
            </div>
        } onHide={onHide}>
            {event && (
                <div className="p-fluid">
                    <div className="p-field">
                        <label>Thời gian</label>
                        <p>{formatEventTime(event.start)} — {formatEventTime(event.end)}</p>
                    </div>
                    <div className="p-field">
                        <label>Giáo viên</label>
                        <p>{event.teacher}</p>
                    </div>
                    <div className="p-field">
                        <label>Phòng</label>
                        <p>{event.room}</p>
                    </div>
                    <div className="p-field">
                        <label>Loại</label>
                        <p>{event.type}</p>
                    </div>
                </div>
            )}
        </Dialog>
    );
}
