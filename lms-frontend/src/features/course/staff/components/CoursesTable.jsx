import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Tag } from 'primereact/tag';

function StatusCell(row) {
    const isActive = row.status === 'active';
    return (
        <Tag
            value={row.status}
            severity={isActive ? 'success' : 'warning'}
        />
    );
}

function RowActions({ row, onView, onEdit, onDelete }) {
    const menuRef = useRef(null);
    const items = [
        { label: 'View Detail', icon: 'pi pi-eye', command: () => onView?.(row) },
        { label: 'Edit Course', icon: 'pi pi-pencil', command: () => onEdit?.(row) },
        { separator: true },
        { label: 'Delete', icon: 'pi pi-trash', className: 'p-menuitem-danger', command: () => onDelete?.(row) },
    ];
    return (
        <>
            <Menu model={items} popup ref={menuRef} />
            <Button
                icon="pi pi-ellipsis-h"
                className="p-button-text p-button-rounded"
                onClick={(e) => menuRef.current?.toggle(e)}
                aria-label="Row actions"
            />
        </>
    );
}

RowActions.propTypes = {
    row: PropTypes.object.isRequired,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default function CoursesTable({
                                         courses,
                                         selected = [],
                                         onSelectionChange,
                                         loading = false,
                                         onView,
                                         onEdit,
                                         onDelete,
                                     }) {
    const header = (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div><strong>Courses</strong></div>
            <div style={{ color: '#6b7280' }}>Total: {courses?.length ?? 0}</div>
        </div>
    );

    const teacherBody = (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag value={row.teacher?.split(' ').slice(-1)[0]?.[0] ?? ''} />
            <div>
                <div><strong>{row.teacher || '-'}</strong></div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{row.class}</div>
            </div>
        </div>
    );

    return (
        <DataTable
            value={courses}
            header={header}
            paginator rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            responsiveLayout="scroll"
            loading={loading}
            dataKey="id"
            selectionMode="checkbox"
            selection={selected}
            onSelectionChange={(e) => onSelectionChange?.(e.value)}
            emptyMessage="No courses found."
        >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

            <Column field="id" header="Course ID" sortable style={{ minWidth: 130 }} />
            <Column field="title" header="Course Name" sortable style={{ minWidth: 220 }} />
            <Column header="Teacher" body={teacherBody} sortable sortField="teacher" style={{ minWidth: 220 }} />
            <Column field="startDate" header="Start Date" sortable style={{ minWidth: 130 }} />
            <Column field="endDate" header="End Date" sortable style={{ minWidth: 130 }} />
            <Column field="capacity" header="Capacity" sortable style={{ minWidth: 110 }} />
            <Column field="enrolled" header="Enrolled" sortable style={{ minWidth: 110 }} />
            <Column header="Status" body={StatusCell} sortable sortField="status" style={{ minWidth: 120 }} />

            <Column
                header=""
                body={(row) => (
                    <RowActions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                )}
                headerStyle={{ width: '3rem' }}
                bodyStyle={{ textAlign: 'right' }}
            />
        </DataTable>
    );
}

CoursesTable.propTypes = {
    courses: PropTypes.array.isRequired,
    selected: PropTypes.array,
    onSelectionChange: PropTypes.func,
    loading: PropTypes.bool,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};
