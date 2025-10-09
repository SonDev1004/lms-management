import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import '../styles/student-management.css';

export default function StudentFilters({ value, onChange, onExport, classes, statusOptions }) {
    const set = (k, v) => onChange[( { setQ:()=>{}, setStatus:()=>{}, setCls:()=>{} } )] || null;

    return (
        <div className="card search-card">
            <div className="card-title">
                <i className="pi pi-filter" />
                <span>Search & Filters</span>
            </div>

            <div className="grid align-items-center">
                <div className="col-12 md:col-5">
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

                <div className="col-12 md:col-1 flex md:justify-content-end">
                    <Button label="Export" icon="pi pi-download" outlined onClick={onExport} />
                </div>
            </div>
        </div>
    );
}
