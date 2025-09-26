import React from "react";
import PropTypes from "prop-types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

function StatusCell(row) {
    const isActive = row.status === "active";
    return <div className={`status-pill ${isActive ? "active" : "inactive"}`}>{row.status}</div>;
}

function Money({ v }) {
    return <span>{(v || 0).toLocaleString("vi-VN")}₫</span>;
}

function RowActions({ row }) {
    const menuRef = React.useRef(null);
    const items = [
        { label: "View Detail", icon: "pi pi-eye", command: () => console.log("view", row) },
        { label: "Edit Program", icon: "pi pi-pencil", command: () => console.log("edit", row) },
        { separator: true },
        { label: "Delete", icon: "pi pi-trash", className: "p-menuitem-danger" },
    ];
    return (
        <>
            <Menu model={items} popup ref={menuRef} />
            <Button icon="pi pi-ellipsis-h" className="p-button-text p-button-rounded" onClick={(e) => menuRef.current?.toggle(e)} />
        </>
    );
}
RowActions.propTypes = { row: PropTypes.object };

export default function ProgramsTable({ programs, loading, selection, onSelectionChange }) {
    return (
        <div className="card">
            <DataTable
                value={programs}
                paginator rows={10}
                responsiveLayout="scroll"
                loading={loading}
                selectionMode="checkbox"
                selection={selection}
                onSelectionChange={onSelectionChange}
                dataKey="id"
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                <Column field="id" header="Program ID" sortable />
                <Column field="name" header="Program Name" sortable />
                <Column field="category" header="Category" sortable />
                <Column field="level" header="Level (CEFR)" sortable />
                <Column field="durationWeeks" header="Duration (wks)" sortable />
                <Column field="fee" header="Tuition" body={(r) => <Money v={r.fee} />} sortable />
                <Column field="totalCourses" header="Courses" sortable />
                <Column field="activeCourses" header="Active" sortable />
                <Column header="Status" body={StatusCell} sortable />
                <Column body={(row) => <RowActions row={row} />} />
            </DataTable>
        </div>
    );
}

ProgramsTable.propTypes = {
    programs: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    selection: PropTypes.array,
    onSelectionChange: PropTypes.func,
};
