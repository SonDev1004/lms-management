import { Button } from 'primereact/button';

import '../styles/student-management.css';
export default function HeaderBar({ onAdd }) {
    return (
        <div className="header-row">
            <div className="title-block">
                <i className="pi pi-users title-icon" />
                <div>
                    <h1 className="title">Student Management</h1>
                    <div className="subtitle">Manage and track all student information</div>
                </div>
            </div>
            <Button label="Add Student" icon="pi pi-plus" className="p-button-lg" onClick={onAdd} />
        </div>
    );
}
