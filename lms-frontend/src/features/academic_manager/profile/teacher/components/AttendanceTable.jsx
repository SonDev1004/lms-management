import { useRef, useState, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';

export default function AttendanceTable({ sessions = [] }) {
    const dt = useRef(null);
    const [filter, setFilter] = useState('all'); // all | yes | no

    const list = useMemo(() => {
        if (filter === 'yes') return sessions.filter(s => s.submitted);
        if (filter === 'no') return sessions.filter(s => !s.submitted);
        return sessions;
    }, [sessions, filter]);

    const statusBody = (row) => (
        <Tag value={row.submitted ? 'Submitted' : 'Not submitted'}
             severity={row.submitted ? 'success' : 'warning'} rounded />
    );

    const start = (
        <div className="tp-segmented" role="tablist" aria-label="Filter status">
            <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>All</button>
            <button className={filter==='yes'?'active':''} onClick={()=>setFilter('yes')}>Submitted</button>
            <button className={filter==='no'?'active':''} onClick={()=>setFilter('no')}>Not submitted</button>
        </div>
    );

    const end = <Button label="Export" icon="pi pi-download" outlined onClick={() => dt.current?.exportCSV()} />;

    const rowClassName = (row) => ({ 'row-soft-left': !row.submitted });

    return (
        <>
            <Toolbar start={start} end={end} className="mb-3 tp-toolbar" />
            <DataTable
                ref={dt}
                value={list}
                showGridlines
                scrollable scrollHeight="60vh"
                stripedRows
                rowClassName={rowClassName}
                emptyMessage="No attendance records."
            >
                <Column field="date" header="Date" sortable className="col-date" />
                <Column field="course" header="Course" sortable />
                <Column field="classId" header="Class" />
                <Column field="session" header="Session" />
                <Column header="Status" body={statusBody} />
                <Column field="updatedAt" header="Last Updated" sortable className="col-updated"
                        body={(r)=> r.updatedAt || '—'} />
            </DataTable>
        </>
    );
}
