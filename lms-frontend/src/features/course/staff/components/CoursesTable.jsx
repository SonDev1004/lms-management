import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

function StatusCell(row) {
    const isActive = row.status === 'active';
    return (
        <div className={`status-pill ${isActive ? 'active' : 'inactive'}`}>
            {row.status}
        </div>
    );
}

function RowActions({ row }) {
    const menuRef = React.useRef(null);
    const items = [
        { label: 'View Detail', icon: 'pi pi-eye', command: () => console.log('view', row) },
        { label: 'Edit Course', icon: 'pi pi-pencil', command: () => console.log('edit', row) },
        { separator: true },
        { label: 'Delete', icon: 'pi pi-trash', className: 'p-menuitem-danger' }
    ];
    return (
        <>
            <Menu model={items} popup ref={menuRef} />
            <Button
                icon="pi pi-ellipsis-h"
                className="p-button-text p-button-rounded"
                onClick={(e) => menuRef.current?.toggle(e)}
            />
        </>
    );
}

RowActions.propTypes = { row: PropTypes.object };

export default function CoursesTable({ courses, loading }) {
    return (
        <div className="card">
            <DataTable
                value={courses}
                paginator rows={10}
                responsiveLayout="scroll"
                loading={loading}
            >
                <Column field="id" header="Course ID" sortable />
                <Column field="title" header="Course Name" sortable />
                <Column field="class" header="Class" sortable />
                <Column field="teacher" header="Teacher" sortable />
                <Column field="startDate" header="Start Date" sortable />
                <Column field="endDate" header="End Date" sortable />
                <Column field="capacity" header="Capacity" sortable />
                <Column field="enrolled" header="Enrolled" sortable />
                <Column header="Status" body={StatusCell} sortable />
                <Column body={(row) => <RowActions row={row} />} />
            </DataTable>
        </div>
    );
}

CoursesTable.propTypes = {
    courses: PropTypes.array.isRequired,
    loading: PropTypes.bool
};
