import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function DocumentsTable({ items: initial }) {
    const [items, setItems] = useState(initial || []);

    const statusBody = (row) => {
        if ((row.status || '').toLowerCase() === 'n/a') {
            return <Tag value="n/a" rounded className="tag-neutral" />;
        }
        const severity = row.status === 'expiring' ? 'warning' : 'info';
        return <Tag value={row.status} severity={severity} rounded />;
    };

    const onDelete = (row) => {
        confirmDialog({
            message: `Delete "${row.name}"?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => setItems(prev => prev.filter(x => x.id !== row.id))
        });
    };

    const actions = (row) => (
        <>
            <Button icon="pi pi-eye" rounded text className="mr-1" tooltip="Preview" />
            <Button icon="pi pi-download" rounded text className="mr-1" tooltip="Download" />
            <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Delete" onClick={() => onDelete(row)} />
        </>
    );

    return (
        <>
            <ConfirmDialog />
            <div className="doc-toolbar">
                <FileUpload mode="basic" name="file" url="/upload" chooseLabel="Upload Document (mock)" customUpload auto />
            </div>
            <DataTable value={items} showGridlines emptyMessage="No documents.">
                <Column field="name" header="File" />
                <Column field="type" header="Type" />
                <Column field="issuedAt" header="Issued" />
                <Column field="expiresAt" header="Expires" />
                <Column header="Status" body={statusBody} />
                <Column header="Actions" body={actions} bodyClassName="doc-actions" style={{ width: 180 }} />
            </DataTable>
        </>
    );
}
