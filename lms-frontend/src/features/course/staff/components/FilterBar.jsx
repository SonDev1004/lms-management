import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import '../styles/Index.css';

export default function FilterBar({
                                      searchText, setSearchText,
                                      classFilter, setClassFilter, classOptions,
                                      courseFilter, setCourseFilter, courseOptions,
                                      statusFilter, setStatusFilter, statusOptions,
                                      onImport, onExport, onAdd,
                                  }) {
    return (
        <div className="course-toolbar">
            <div className="course-toolbar-left">
                <span className="p-input-icon-left course-search">
                    <i className="pi pi-search" />
                    <InputText
                        placeholder="Search by name, ID, email, or phone..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </span>

                <div className="course-filter-group">
                    <Dropdown
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.value)}
                        options={classOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="All Classes"
                        showClear
                    />

                    <Dropdown
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.value)}
                        options={courseOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="All Courses"
                        showClear
                    />

                    <Dropdown
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.value)}
                        options={statusOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="All Status"
                        showClear
                    />
                </div>
            </div>

            <div className="course-toolbar-right">
                <Button label="Import" icon="pi pi-upload" className="p-button-outlined" onClick={onImport} />
                <Button label="Export" icon="pi pi-download" className="p-button-outlined" onClick={onExport} />
                <Button label="+ Add Student" icon="pi pi-plus" className="p-button-success" onClick={onAdd} />
            </div>
        </div>
    );
}

FilterBar.propTypes = {
    searchText: PropTypes.string.isRequired,
    setSearchText: PropTypes.func.isRequired,
    classFilter: PropTypes.any,
    setClassFilter: PropTypes.func.isRequired,
    classOptions: PropTypes.array.isRequired,
    courseFilter: PropTypes.any,
    setCourseFilter: PropTypes.func.isRequired,
    courseOptions: PropTypes.array.isRequired,
    statusFilter: PropTypes.any,
    setStatusFilter: PropTypes.func.isRequired,
    statusOptions: PropTypes.array.isRequired,
    onImport: PropTypes.func,
    onExport: PropTypes.func,
    onAdd: PropTypes.func,
};
