import React from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

const fmtVND = (v) =>
    (Number(v ?? 0)).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function ProgramsTable({
                                          programs = [],
                                          selection = [],
                                          onSelectionChange,
                                          loading,
                                          onView,
                                          onEdit,
                                          onDelete,

                                          // server paging (optional)
                                          page = 0,
                                          size = 10,
                                          total = 0,
                                          onPageChange,
                                      }) {
    const statusTemplate = (row) => (
        <Tag
            value={row.isActive ? "active" : "inactive"}
            severity={row.isActive ? "success" : "warning"}
            rounded
        />
    );

    const studentsTemplate = (row) => `${row.minStudent ?? 0} - ${row.maxStudent ?? 0}`;

    const descTemplate = (row) => {
        const d = row.description || "";
        return (
            <span title={d}>
        {d.length > 60 ? d.slice(0, 60) + "…" : d || "-"}
      </span>
        );
    };

    const actionsTemplate = (row) => (
        <div className="flex items-center gap-2">
            <Button icon="pi pi-eye" rounded text onClick={() => onView?.(row)} aria-label="View" />
            <Button icon="pi pi-pencil" rounded text onClick={() => onEdit?.(row)} aria-label="Edit" />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => onDelete?.(row)} aria-label="Delete" />
        </div>
    );

    return (
        <Card className="card program-table-card">
            <DataTable
                value={programs}
                loading={loading}
                selection={selection}
                onSelectionChange={onSelectionChange}
                dataKey="id"
                paginator
                rows={size}
                first={page * size}
                totalRecords={total}
                onPage={(e) => onPageChange?.({ page: Math.floor(e.first / e.rows), size: e.rows })}
                responsiveLayout="scroll"
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                <Column field="code" header="Code" sortable />
                <Column field="title" header="Title" sortable />
                <Column header="Students" body={studentsTemplate} />
                <Column header="Fee" body={(row) => fmtVND(row.fee)} sortable />
                <Column header="Status" body={statusTemplate} sortable />
                <Column header="Description" body={descTemplate} />
                <Column header="" body={actionsTemplate} style={{ width: 140 }} />
            </DataTable>
        </Card>
    );
}
