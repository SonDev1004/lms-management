import React from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { downloadCSV, toCSV } from '../../utils/studentProfile.utils';

export default function GradesPanel({ student, courses }) {
    const exportTranscript = () => {
        const header = ['Subject', 'Midterm', 'Final', 'Assignments', 'Total'];
        const rows = courses.map((c) => ({
            Subject: c.code,
            Midterm: c.midterm ?? '',
            Final: c.final ?? '',
            Assignments: c.assignments ?? '',
            Total: c.total ?? '',
        }));
        downloadCSV(`${student.id}_transcript.csv`, toCSV(rows, header));
    };

    return (
        <div className="sp-card">
            <div className="sp-card-title">
                <span><i className="pi pi-trophy sp-ic" /> Grades & Reports</span>
                <Button icon="pi pi-download" label="Download Transcript" onClick={exportTranscript} />
            </div>

            <DataTable
                value={courses}
                className="p-datatable-sm"
                paginator
                rows={10}
                emptyMessage="No grade data"
            >
                <Column field="code" header="Subject" />
                <Column field="midterm" header="Midterm" body={(r) => r.midterm ?? '--'} />
                <Column field="final" header="Final" body={(r) => r.final ?? '--'} />
                <Column field="assignments" header="Assignments" body={(r) => r.assignments ?? '--'} />
                <Column field="total" header="Total" body={(r) => r.total ?? '--'} />
            </DataTable>
        </div>
    );
}
