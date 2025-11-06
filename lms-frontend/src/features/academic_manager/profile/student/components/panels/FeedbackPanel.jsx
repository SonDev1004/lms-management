import React from 'react';
import { Tag } from 'primereact/tag';
import { fmtDate } from '../../utils/studentProfile.utils';

export default function FeedbackPanel({ student }) {
    const list = student.feedback || [];
    return (
        <div className="sp-card">
            <div className="sp-card-title">
                <span><i className="pi pi-comments sp-ic" /> Teacher Feedback & Notes</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {list.map((fb) => (
                    <div
                        key={fb.id}
                        style={{
                            border: '1px solid #e8ecf2',
                            borderRadius: 12,
                            padding: 16,
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: 8,
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 800, marginBottom: 6 }}>
                                {fb.teacher}{' '}
                                <span style={{ color: '#6b7280', fontWeight: 600, marginLeft: 8 }}>{fb.course}</span>
                            </div>
                            <div style={{ color: '#1f2937' }}>{fb.note}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                            <Tag
                                value={fb.sentiment}
                                severity={
                                    fb.sentiment === 'positive' ? 'success'
                                        : fb.sentiment === 'improvement' ? 'warning'
                                            : 'info'
                                }
                            />
                            <div style={{ color: '#6b7280' }}>{fmtDate(fb.date)}</div>
                        </div>
                    </div>
                ))}
                {list.length === 0 && <div style={{ color: '#6b7280' }}>No feedback</div>}
            </div>
        </div>
    );
}
