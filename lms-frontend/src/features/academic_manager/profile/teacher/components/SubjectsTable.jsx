import { useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

export default function SubjectsTable({ classes = [], onAssign }) {
    const dt = useRef(null);
    const left = <Button label="Assign Class" icon="pi pi-plus" onClick={() => onAssign?.()} />;
    const right = <Button label="Export" icon="pi pi-download" outlined onClick={() => dt.current?.exportCSV()} />;

    const actions = () => (
        <>
            <Button icon="pi pi-eye" rounded text className="mr-2" tooltip="View class" />
            <Button icon="pi pi-sync" rounded text tooltip="Sync" />
        </>
    );

    return (
        <>
            <Toolbar start={left} end={right} className="mb-3 tp-toolbar" />
            <DataTable
                ref={dt}
                value={classes}
                paginator rows={5}
                showGridlines
                scrollable scrollHeight="60vh"
                stripedRows
                emptyMessage="No class assigned."
            >
                <Column field="subject" header="Subject" sortable />
                <Column field="course" header="Course" sortable />
                <Column field="term" header="Term" sortable />
                <Column field="students" header="Students" sortable />
                <Column field="schedule" header="Schedule" />
                <Column field="campus" header="Campus" />
                <Column header="Actions" body={actions} style={{ width: 140 }} />
            </DataTable>
        </>
    );
}
