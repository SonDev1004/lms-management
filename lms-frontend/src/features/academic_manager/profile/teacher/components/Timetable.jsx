import { useMemo, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Timetable({ classes = [] }) {
    const [weekStart, setWeekStart] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); return d;
    });

    const rows = useMemo(() => classes.map((c, idx) => {
        const [day, time, , room] = c.schedule.split(/\s+|\|/).filter(Boolean);
        return { id: idx+1, day, time, room: (room||'').trim(), course: c.course };
    }), [classes]);

    const exportICS = () => {
        const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//NGOC//Teacher Timetable//EN'];
        const now = new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
        const parseTime = (t='08:00–10:00') => {
            const [s,e] = t.replace('-', '–').split('–');
            const [sh, sm] = s.split(':').map(Number); const [eh, em] = e.split(':').map(Number);
            return { sh, sm, eh, em };
        };
        rows.forEach((r,i)=>{
            const dow = DOW.indexOf(r.day);
            const start = new Date(weekStart);
            if (dow>=0) start.setDate(start.getDate() + dow);
            const {sh,sm,eh,em} = parseTime(r.time);
            start.setHours(sh||8, sm||0, 0, 0);
            const end = new Date(start); end.setHours(eh||sh+2, em||sm, 0, 0);
            const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
            lines.push('BEGIN:VEVENT',`UID:${i}-${now}@ngoc`,`DTSTAMP:${now}`,`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,
                `SUMMARY:${r.course}`,`LOCATION:${r.room}`,'END:VEVENT');
        });
        lines.push('END:VCALENDAR');
        const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob); const a = document.createElement('a');
        a.href = url; a.download = 'timetable.ics'; a.click(); URL.revokeObjectURL(url);
    };

    const weekLabel = `Week of ${weekStart.toLocaleDateString()}`;

    return (
        <div>
            <div className="tp-toolbar">
                <div className="tp-weeklabel">{weekLabel}</div>
                <Calendar value={weekStart} onChange={(e) => {
                    const d = new Date(e.value); d.setDate(d.getDate() - d.getDay()); d.setHours(0,0,0,0); setWeekStart(d);
                }} dateFormat="dd/mm/yy" showIcon />
                <div className="grow" />
                <Button label="Export iCal" icon="pi pi-calendar" outlined onClick={exportICS} />
                <Button label="Print" icon="pi pi-print" className="ml-2" onClick={() => window.print()} />
            </div>

            <DataTable value={rows} showGridlines stripedRows>
                <Column field="day" header="Day" sortable />
                <Column field="time" header="Time" />
                <Column field="room" header="Room" />
                <Column field="course" header="Course" />
            </DataTable>
        </div>
    );
}
