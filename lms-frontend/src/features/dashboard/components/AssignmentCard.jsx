import React from 'react';
import { Button } from 'primereact/button';

export default function AssignmentCard({ assign }) {
    return (
        <div className="assignment-card sd-card">
            <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="status-dot" style={{ borderColor: 'var(--accent)' }}></div>
                </div>
                <div>
                    <div style={{ fontWeight: 700 }}>{assign.title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{assign.meta}</div>
                    <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 13 }}>Due: {assign.due}</div>
                    <div style={{ marginTop: 10 }}><Button label="Đang làm" className="p-button-sm p-button-outlined" /></div>
                </div>
            </div>
        </div>
    );
}
