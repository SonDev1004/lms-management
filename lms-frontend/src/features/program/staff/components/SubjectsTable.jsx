import React, { useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

function fmtVND(v) {
    const n = Number(v ?? 0);
    return n.toLocaleString("vi-VN") + " đ";
}

export default function SubjectsTable({
                                          subjects = [],
                                          loading = false,
                                          page0 = 0,
                                          size = 10,
                                          totalItems = 0,
                                          onPageChange,
                                          onView,
                                          onEdit,
                                          onDelete,
                                          onCreate, // 👈 NEW
                                          selection,
                                          onSelectionChange,
                                      }) {
    const first = page0 * size;

    const statusBody = (row) => (
        <Tag
            value={row.isActive ? "active" : "inactive"}
            severity={row.isActive ? "success" : "warning"}
            style={{ borderRadius: 999 }}
        />
    );

    const feeBody = (row) => fmtVND(row.fee);

    const studentsBody = (row) => {
        const min = row.minStudent ?? row.minStudents ?? 0;
        const max = row.maxStudent ?? row.maxStudents ?? 0;
        return `${min} - ${max}`;
    };

    const actionsBody = (row) => (
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Button icon="pi pi-eye" rounded text onClick={() => onView?.(row)} />
            {onEdit && <Button icon="pi pi-pencil" rounded text onClick={() => onEdit(row)} />}
            {onDelete && (
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    onClick={() => onDelete(row)}
                />
            )}
        </div>
    );

    const empty = useMemo(() => (loading ? "Loading..." : "No subjects found."), [loading]);

    return (
        <div className="p-card" style={{ padding: 12 }}>
            {/* ===== HEADER ===== */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>
                    Total subjects: <b>{totalItems}</b>
                </div>
                {onCreate && (
                    <Button label="Add Subject" icon="pi pi-plus" onClick={onCreate} />
                )}
            </div>

            <Divider className="my-2" />

            {/* ===== TABLE ===== */}
            <DataTable
                value={subjects}
                loading={loading}
                dataKey="id"
                paginator
                lazy
                first={first}
                rows={size}
                totalRecords={totalItems}
                onPage={(e) => onPageChange?.({ page0: e.page, size: e.rows })}
                selection={selection}
                onSelectionChange={onSelectionChange}
                emptyMessage={empty}
                responsiveLayout="scroll"
                rowHover
            >
                {onSelectionChange && (
                    <Column selectionMode="multiple" headerStyle={{ width: 48 }} />
                )}

                <Column field="id" header="ID" sortable style={{ width: 90 }} />
                <Column field="title" header="Title" sortable />
                <Column field="code" header="Code" sortable style={{ width: 220 }} />
                <Column field="sessionNumber" header="Sessions" sortable style={{ width: 140 }} />
                <Column header="Fee" body={feeBody} sortable style={{ width: 160 }} />
                <Column header="Students" body={studentsBody} style={{ width: 140 }} />
                <Column header="Status" body={statusBody} style={{ width: 140 }} />
                <Column header="Actions" body={actionsBody} style={{ width: 170 }} />
            </DataTable>
        </div>
    );
}
