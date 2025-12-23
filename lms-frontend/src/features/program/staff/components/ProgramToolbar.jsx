import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export default function ProgramToolbar({
                                           searchText,
                                           setSearchText,
                                           status, // null | true | false
                                           statusOptions,
                                           onStatusChange,
                                           onImport,
                                           onExport,
                                           onAddProgram,
                                           onAddSubject,
                                       }) {
    return (
        <div className="p-card p-p-3 header-row sticky">
            <div className="toolbar-left">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
              placeholder="Search by code/title…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
          />
        </span>

                <Dropdown
                    value={status}
                    onChange={(e) => onStatusChange(e.value)}
                    options={statusOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="All Status"
                    showClear
                />
            </div>

            <div className="toolbar-right">
                <Button label="Import" icon="pi pi-upload" className="p-button-outlined" onClick={onImport} />
                <Button label="Export" icon="pi pi-download" className="p-button-outlined" onClick={onExport} />
                <Button label="+ Add Subject" icon="pi pi-book" className="p-button-help" onClick={onAddSubject} />
                <Button label="+ Add Program" icon="pi pi-plus" className="p-button-success" onClick={onAddProgram} />
            </div>
        </div>
    );
}
