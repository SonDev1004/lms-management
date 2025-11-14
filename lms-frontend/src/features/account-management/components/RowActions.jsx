import React from "react";

export default function RowActions({ onView, onEdit, onToggleStatus, onResetPwd }){
    return (
        <div className="am-actions">
            <button className="icon-btn" title="View" onClick={onView}><i className="pi pi-eye"/></button>
            <button className="icon-btn" title="Edit" onClick={onEdit}><i className="pi pi-pencil"/></button>
            <button className="icon-btn" title="Activate/Deactivate" onClick={onToggleStatus}><i className="pi pi-check-circle"/></button>
            <button className="icon-btn" title="Reset password" onClick={onResetPwd}><i className="pi pi-key"/></button>
        </div>
    );
}
