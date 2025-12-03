import React from "react";
import {Dialog} from "primereact/dialog";
import {Avatar} from "primereact/avatar";
import {Button} from "primereact/button";
import {Chip} from "primereact/chip";

const TYPE_MAP = {
    assignment: {label: "Assignment", color: "#2563eb"},
    event: {label: "Event", color: "#f97316"},
    feedback: {label: "Feedback", color: "#7c3aed"},
    system: {label: "System", color: "#6b7280"},
};

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN") : "");

export default function NotificationDetailDialog({visible, onHide, notification, onDelete}) {
    if (!notification) {
        return (
            <Dialog visible={visible} onHide={onHide} header="Details">
                <div>Không có dữ liệu thông báo.</div>
            </Dialog>
        );
    }

    const t =
        TYPE_MAP[notification.type] || {
            label: notification.type || "System",
            color: "#9ca3af",
        };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            style={{width: "46vw", maxWidth: 900}}
            header={
                <div style={{display: "flex", alignItems: "center", gap: 12}}>
                    <Avatar
                        label={(notification.sender || "S")[0]}
                        shape="circle"
                        style={{backgroundColor: "#556ee6", color: "white"}}
                    />
                    <div style={{flex: 1}}>
                        <div style={{fontWeight: 600, fontSize: 16}}>
                            {notification.title}
                        </div>
                        <div style={{fontSize: 12, color: "#6b7280"}}>
                            {notification.sender}
                            {notification.postedDate && ` • ${fmtDate(notification.postedDate)}`}
                            {notification.course ? ` • ${notification.course}` : ""}
                        </div>
                    </div>
                    <Chip
                        label={t.label.toUpperCase()}
                        style={{backgroundColor: t.color, color: "white"}}
                    />
                </div>
            }
        >
            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                {/* content là HTML nên render bằng dangerouslySetInnerHTML */}
                <div
                    style={{color: "#374151", lineHeight: 1.6}}
                    dangerouslySetInnerHTML={{__html: notification.content || ""}}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 8,
                    }}
                >
                    <Button label="Close" className="p-button-text" onClick={onHide}/>
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        onClick={async () => {
                            if (!window.confirm("Are you sure you want to delete?")) return;
                            await onDelete?.(notification.id);
                            onHide();
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
}
