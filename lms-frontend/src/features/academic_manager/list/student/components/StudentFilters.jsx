import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import '../styles/student-management.css';

export default function StudentFilters({ value, onChange, onExport, classes, statusOptions }) {
    return (
        <div className="card search-card">
            <div className="card-title">
                <i className="pi pi-filter" />
                <span>Search & Filters</span>
            </div>

            {/* thêm class search-grid cho dễ style */}
            <div className="grid align-items-center search-grid">
                {/* Search */}
                <div className="col-12 md:col-4">
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText
                            className="w-full"
                            value={value.q}
                            onChange={(e) => onChange.setQ(e.target.value)}
                            placeholder="Search by name, ID, or class..."
                        />
                    </span>
                </div>

                {/* Status */}
                <div className="col-6 md:col-3">
                    <Dropdown
                        className="w-full"
                        value={value.status}
                        onChange={(e) => onChange.setStatus(e.value)}
                        options={statusOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="All Status"
                        showClear
                    />
                </div>

                {/* Class */}
                <div className="col-6 md:col-3">
                    <Dropdown
                        className="w-full"
                        value={value.cls}
                        onChange={(e) => onChange.setCls(e.value)}
                        options={classes}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="All Classes"
                        showClear
                    />
                </div>

                {/* Export – md:col-2 để rộng hơn, không bị cắt chữ */}
                <div className="col-12 md:col-2 flex md:justify-content-end export-col">
                    <Button
                        label="Export"
                        icon="pi pi-download"
                        outlined
                        className="w-full md:w-auto"
                        onClick={onExport}
                    />
                </div>
            </div>
        </div>
    );
}
