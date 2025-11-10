import { Button } from "primereact/button";

export default function AuditToolbar({ onRefresh, onExport }) {
    return (
        <div className="audit-actions">
            <Button label="Refresh" icon="pi pi-refresh" outlined onClick={onRefresh} />
            <Button label="Export CSV" icon="pi pi-download" outlined onClick={onExport} />
        </div>
    );
}
