import React from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

export default function ProgramsTable({
                                          programs = [],
                                          selection = [],
                                          onSelectionChange,
                                          loading,
                                          onView,
                                          onEdit,
                                          onDelete,
                                      }) {
    const statusTemplate = (row) => (
        <Tag
            value={row.status}
            severity={row.status === "active" ? "success" : "warning"}
        />
    );

    const coursesTemplate = (row) =>
        `${row.activeCourses}/${row.totalCourses}`;

    const tuitionTemplate = (row) =>
        (row.fee ?? 0).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });

    const actionsTemplate = (row) => (
        <div className="flex items-center gap-2">
            <Button
                icon="pi pi-eye"
                rounded
                text
                onClick={() => onView?.(row)}
                aria-label="View"
            />
            <Button
                icon="pi pi-pencil"
                rounded
                text
                onClick={() => onEdit?.(row)}
                aria-label="Edit"
            />
            <Button
                icon="pi pi-trash"
                rounded
                text
                severity="danger"
                onClick={() => onDelete?.(row)}
                aria-label="Delete"
            />
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
                rows={10}
                responsiveLayout="scroll"
            >
                <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                />
                <Column field="id" header="Program ID" sortable />
                <Column field="name" header="Program Name" sortable />
                <Column field="level" header="Level (CEFR)" sortable />
                <Column
                    field="durationWeeks"
                    header="Duration (wks)"
                    sortable
                />
                <Column header="Tuition" body={tuitionTemplate} sortable />
                <Column header="Courses" body={coursesTemplate} sortable />
                <Column header="Status" body={statusTemplate} sortable />
                <Column header="" body={actionsTemplate} style={{ width: 140 }} />
            </DataTable>
        </Card>
    );
}
