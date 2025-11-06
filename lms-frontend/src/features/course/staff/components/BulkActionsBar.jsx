import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import '../styles/Index.css';

export default function BulkActionsBar({
                                           selectedCount, onSelectAll, onClear,
                                           onActivate, onDeactivate, onExportSelected, onDelete
                                       }) {
    if (!selectedCount) return null;

    return (
        <div className="p-card p-p-3 action-container">
            <div className="action-left">
                <div><strong>{selectedCount}</strong> students selected</div>
                <Button label="Select All" icon="pi pi-check-square" className="p-button-text" onClick={onSelectAll} />
                <Button label="Clear" icon="pi pi-times" className="p-button-text" onClick={onClear} />
            </div>
            <div className="action-right">
                <Button label="Activate" icon="pi pi-user-plus" className="p-button-outlined" onClick={onActivate} />
                <Button label="Deactivate" icon="pi pi-user-minus" className="p-button-outlined" onClick={onDeactivate} />
                <Button label="Export Selected" icon="pi pi-download" className="p-button-outlined" onClick={onExportSelected} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={onDelete} />
            </div>
        </div>
    );
}

BulkActionsBar.propTypes = {
    selectedCount: PropTypes.number.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onActivate: PropTypes.func.isRequired,
    onDeactivate: PropTypes.func.isRequired,
    onExportSelected: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
