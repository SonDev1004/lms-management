import React, { useMemo, useState } from 'react';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

const StatusPill = ({ value }) => {
    const k = String(value || '').toLowerCase();
    if (k.includes('full'))   return <Tag value="Full" severity="danger" rounded />;
    if (k.includes('fill'))   return <Tag value="Filling fast" severity="warning" rounded />;
    return <Tag value="Open" severity="success" rounded />;
};

export default function SubjectClassTable({ classes = [], onRegister }) {
    const [mode, setMode] = useState('All');
    const [campus, setCampus] = useState('All');
    const [date, setDate] = useState(null);

    const campusOptions = useMemo(() => {
        const set = new Set();
        classes.forEach(c => set.add(c.place || c.room || '—'));
        return ['All', ...[...set]];
    }, [classes]);

    const filtered = useMemo(() => {
        return (classes || []).filter(c => {
            const byMode = mode === 'All' || String(c.mode || '').toLowerCase().includes(mode.toLowerCase());
            const byCampus = campus === 'All' || (c.place || c.room || '—') === campus;
            const byDate = !date || (c.startDate && new Date(c.startDate) >= new Date(date.setHours(0,0,0,0)));
            return byMode && byCampus && byDate;
        });
    }, [classes, mode, campus, date]);

    return (
        <section className="sd-card">
            <div className="sd-table-head">
                <h3 className="sd-h3 m-0">Sessions</h3>
                <div className="sd-filters">
                    <Dropdown
                        value={mode}
                        onChange={(e) => setMode(e.value)}
                        options={['All', 'Campus', 'Online', 'Hybrid']}
                        placeholder="Mode"
                        className="w-10rem"
                    />
                    <Dropdown
                        value={campus}
                        onChange={(e) => setCampus(e.value)}
                        options={campusOptions}
                        placeholder="Campus"
                        className="w-12rem"
                    />
                    <Calendar
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        placeholder="mm/dd/yyyy"
                        showIcon
                        dateFormat="mm/dd/yy"
                    />
                </div>
            </div>

            <div className="sd-table">
                <div className="sd-tr sd-tr--head">
                    <div>Date &amp; Time</div>
                    <div>Room / Zoom</div>
                    <div>Capacity</div>
                    <div>Status</div>
                    <div>Action</div>
                </div>

                {filtered.map((c) => (
                    <div className="sd-tr" key={c.courseId}>
                        <div>
                            <div className="font-medium">{c.startDate}</div>
                            <div className="sd-time">{c.schedule}</div>
                        </div>
                        <div>{c.place || c.room || '—'}</div>
                        <div>{c.capacity ?? '—'}</div>
                        <div><StatusPill value={c.status || c.statusName} /></div>
                        <div>
                            <Button
                                label={String(c.status || '').toLowerCase().includes('full') ? 'Full' : 'Enroll'}
                                disabled={String(c.status || '').toLowerCase().includes('full')}
                                onClick={() => onRegister?.(c.courseId, c.courseTitle, c.schedule, c.startDate)}
                            />
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="p-3 text-center text-600">Không có lớp phù hợp bộ lọc.</div>
                )}
            </div>
        </section>
    );
}
