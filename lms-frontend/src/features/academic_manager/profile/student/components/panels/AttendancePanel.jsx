import React from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { fmtDate, downloadCSV, toCSV } from '../../utils/studentProfile.utils';

export default function AttendancePanel({ student }) {
    const exportAttendance = () => {
        const header = ['Date', 'Course', 'Status'];
        const rows = (student.attendance ?? []).map((a) => ({
            Date: fmtDate(a.date),
            Course: a.course,
            Status: a.status,
        }));
        downloadCSV(`${student.id}_attendance.csv`, toCSV(rows, header));
    };

    return (
        <div className="sp-card">
            <div className="sp-card-title">
                <span><i className="pi pi-calendar sp-ic" /> Attendance Records</span>
                <Button icon="pi pi-download" label="Export" onClick={exportAttendance} />
            </div>

            <DataTable
                value={student.attendance || []}
                className="p-datatable-sm"
                paginator
                rows={10}
                emptyMessage="No attendance records"
            >
                <Column field="date" header="Date" body={(r) => fmtDate(r.date)} />
                <Column field="course" header="Course" />
                <Column
                    header="Status"
                    body={(r) => (
                        <Tag
                            value={r.status}
                            severity={r.status === 'Present' ? 'success' : r.status === 'Late' ? 'warning' : 'danger'}
                        />
                    )}
                />
            </DataTable>
        </div>
    );
}
