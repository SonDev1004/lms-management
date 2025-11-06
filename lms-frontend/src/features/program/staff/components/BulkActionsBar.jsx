import React from "react";
import { Button } from "primereact/button";

export default function BulkActionsBar({
                                           count, onSelectAll, onClearSel, onActivate, onDeactivate, onExportSel, onDeleteSel,
                                       }) {
    if (!count) return null;
    return (
        <div className="p-card p-p-3 action-container">
            <div className="action-left">
                <div><strong>{count}</strong> programs selected</div>
                <Button label="Select All" icon="pi pi-check-square" className="p-button-text" onClick={onSelectAll} />
                <Button label="Clear" icon="pi pi-times" className="p-button-text" onClick={onClearSel} />
            </div>
            <div className="action-right">
                <Button label="Activate" icon="pi pi-check" className="p-button-outlined" onClick={onActivate} />
                <Button label="Deactivate" icon="pi pi-ban" className="p-button-outlined" onClick={onDeactivate} />
                <Button label="Export Selected" icon="pi pi-download" className="p-button-outlined" onClick={onExportSel} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={onDeleteSel} />
            </div>
        </div>
    );
}
