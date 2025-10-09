import React, { useRef } from "react";
import PropTypes from "prop-types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

function StatusCell(row) {
    const isActive = row.status === "active";
    return <span className={`status-pill ${isActive ? "active" : "inactive"}`}>{row.status}</span>;
}

function Money({ v }) {
    return <span>{(v || 0).toLocaleString("vi-VN")}₫</span>;
}
Money.propTypes = { v: PropTypes.number };

function RowActions({ row, onView, onEdit, onDelete }) {
    const menuRef = useRef(null);
    const items = [
        { label: "View Detail", icon: "pi pi-eye", command: () => onView?.(row) },
        { label: "Edit Program", icon: "pi pi-pencil", command: () => onEdit?.(row) },
        { separator: true },
        { label: "Delete", icon: "pi pi-trash", className: "p-menuitem-danger", command: () => onDelete?.(row) },
    ];
    return (
        <>
            <Menu model={items} popup ref={menuRef} />
            <Button icon="pi pi-ellipsis-h" className="p-button-text p-button-rounded" onClick={(e) => menuRef.current?.toggle(e)} />
        </>
    );
}
RowActions.propTypes = {
    row: PropTypes.object.isRequired,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

export default function ProgramsTable({
                                          programs,
                                          loading = false,
                                          selection = [],
                                          onSelectionChange,
                                          onView,
                                          onEdit,
                                          onDelete,
                                      }) {
    return (
        <div className="card">
            <DataTable
                value={programs}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                responsiveLayout="scroll"
                loading={loading}
                selectionMode="checkbox"
                selection={selection}
                onSelectionChange={onSelectionChange}
                dataKey="id"
                emptyMessage="No programs found."
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                <Column field="id" header="Program ID" sortable style={{ minWidth: 120 }} />
                <Column field="name" header="Program Name" sortable style={{ minWidth: 220 }} />
                <Column field="category" header="Category" sortable style={{ minWidth: 140 }} />
                <Column field="level" header="Level (CEFR)" sortable style={{ minWidth: 130 }} />
                <Column field="durationWeeks" header="Duration (wks)" sortable style={{ minWidth: 120 }} />
                <Column header="Tuition" body={(r) => <Money v={r.fee} />} sortable sortField="fee" style={{ minWidth: 140 }} />
                <Column
                    header="Courses"
                    body={(r) => `${r.activeCourses ?? 0}/${r.totalCourses ?? 0}`}
                    sortable
                    sortField="totalCourses"
                    style={{ minWidth: 110 }}
                />
                <Column header="Status" body={StatusCell} sortable sortField="status" style={{ minWidth: 110 }} />
                <Column
                    header=""
                    body={(row) => <RowActions row={row} onView={onView} onEdit={onEdit} onDelete={onDelete} />}
                    headerStyle={{ width: "3rem" }}
                    bodyStyle={{ textAlign: "right" }}
                />
            </DataTable>
        </div>
    );
}

ProgramsTable.propTypes = {
    programs: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    selection: PropTypes.array,
    onSelectionChange: PropTypes.func,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};
