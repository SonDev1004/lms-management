import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

export default function TeacherFilters({ value, onChange, onExport, departments, statusOptions, subjects, empTypes }) {
    return (
        <div className="card search-card">
            <div className="card-title"><i className="pi pi-filter" /><span>Search & Filters</span></div>
            <div className="grid align-items-center">
                <div className="col-12 md:col-4">
          <span className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText className="w-full" value={value.q}
                       onChange={(e) => onChange.setQ(e.target.value)}
                       placeholder="Search by name, ID, email, subject..."
            />
          </span>
                </div>
                <div className="col-6 md:col-2">
                    <Dropdown className="w-full" value={value.status} onChange={(e)=>onChange.setStatus(e.value)}
                              options={statusOptions} optionLabel="label" optionValue="value" placeholder="All Status" showClear />
                </div>
                <div className="col-6 md:col-2">
                    <Dropdown className="w-full" value={value.dept} onChange={(e)=>onChange.setDept(e.value)}
                              options={departments} optionLabel="label" optionValue="value" placeholder="Department" showClear />
                </div>
                <div className="col-6 md:col-2">
                    <Dropdown className="w-full" value={value.subject} onChange={(e)=>onChange.setSubject(e.value)}
                              options={subjects} placeholder="Subject" showClear />
                </div>
                <div className="col-6 md:col-2">
                    <Dropdown className="w-full" value={value.emp} onChange={(e)=>onChange.setEmp(e.value)}
                              options={empTypes} optionLabel="label" optionValue="value" placeholder="Employment" showClear />
                </div>
                <div className="col-12 md:col-12 flex md:justify-content-end">
                    <Button label="Export" icon="pi pi-download" outlined onClick={onExport} />
                </div>
            </div>
        </div>
    );
}
