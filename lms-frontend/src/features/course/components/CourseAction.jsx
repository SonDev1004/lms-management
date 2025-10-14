import React from "react";
import { Button } from "primereact/button";

export default function CourseActions({ role, course, onAction }) {
    let actions = [];
    if (role === "teacher") {
        actions = [
            { label: "Students", icon: "pi pi-users", action: "students" },
            { label: "Grading", icon: "pi pi-check-square", action: "grading" },
            { label: "Documents", icon: "pi pi-file", action: "documents" },
            { label: "Enter class", icon: "pi pi-sign-in", action: "dashboard" },
            { label: "Details", icon: "pi pi-info-circle", action: "details" }
        ];
    } else if (role === "adminIT") {
        actions = [
            { label: "Students", icon: "pi pi-users", action: "students" },
            { label: "Edit", icon: "pi pi-pencil", action: "edit" },
            { label: "Assign Teacher", icon: "pi pi-user-plus", action: "assignTeacher" },
            { label: "Documents", icon: "pi pi-file", action: "documents" },
            { label: "Delete", icon: "pi pi-trash", action: "delete", severity: "danger" },
            { label: "Export", icon: "pi pi-download", action: "export" },
            { label: "Details", icon: "pi pi-info-circle", action: "details" }
        ];
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {actions.map(btn => (
                <Button
                    key={btn.action}
                    icon={btn.icon}
                    label={btn.label}
                    severity={btn.severity}
                    size="small"
                    onClick={() => onAction && onAction(btn.action, course)}
                />
            ))}
        </div>
    );
}
