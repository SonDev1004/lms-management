import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export default function ProgramToolbar({
                                           searchText, setSearchText,
                                           level, status, levelOptions, statusOptions,
                                           onLevelChange, onStatusChange,
                                           onImport, onExport, onAddProgram, onAddSubject,
                                       }) {
    return (
        <div className="p-card p-p-3 header-row sticky">
            <div className="toolbar-left" style={{ display:"flex", alignItems:"center", gap:8 }}>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
              placeholder="Search by program, ID, level…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 360 }}
          />
        </span>

                <Dropdown value={level} onChange={(e) => onLevelChange(e.value)}
                          options={levelOptions} optionLabel="label" optionValue="value"
                          placeholder="All Levels" style={{ width: 160 }} showClear />

                <Dropdown value={status} onChange={(e) => onStatusChange(e.value)}
                          options={statusOptions} optionLabel="label" optionValue="value"
                          placeholder="All Status" style={{ width: 140 }} showClear />
            </div>

            <div className="toolbar-right" style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Button label="Import" icon="pi pi-upload" className="p-button-outlined" onClick={onImport} />
                <Button label="Export" icon="pi pi-download" className="p-button-outlined" onClick={onExport} />
                <Button label="+ Add Subject" icon="pi pi-book" className="p-button-help" onClick={onAddSubject} />
                <Button label="+ Add Program" icon="pi pi-plus" className="p-button-success" onClick={onAddProgram} />
            </div>
        </div>
    );
}
