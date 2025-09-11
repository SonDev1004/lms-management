// CourseActions.jsx
import React from "react";
import { Button } from "primereact/button";

export default function CourseActions({ role, course, onAction }) {
    // Define action list cho từng role
    let actions = [];
    if (role === "teacher") {
        actions = [
            { label: "DSHV", icon: "pi pi-users", action: "students" },
            { label: "Chấm điểm", icon: "pi pi-check-square", action: "grading" },
            { label: "Tài liệu", icon: "pi pi-file", action: "documents" },
            { label: "Vào lớp", icon: "pi pi-sign-in", action: "dashboard" },
            { label: "Chi tiết", icon: "pi pi-info-circle", action: "details" }
        ];
    } else if (role === "adminIT") {
        actions = [
            { label: "DSHV", icon: "pi pi-users", action: "students" },
            { label: "Chỉnh sửa", icon: "pi pi-pencil", action: "edit" },
            { label: "Phân quyền GV", icon: "pi pi-user-plus", action: "assignTeacher" },
            { label: "Tài liệu", icon: "pi pi-file", action: "documents" },
            { label: "Xoá", icon: "pi pi-trash", action: "delete", severity: "danger" },
            { label: "Export", icon: "pi pi-download", action: "export" },
            { label: "Chi tiết", icon: "pi pi-info-circle", action: "details" }
        ];
    }
    //Thêm Staff sau. 

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
