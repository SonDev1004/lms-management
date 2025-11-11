import LicenseItem from "./LicenseItem";

export default function LicenseStatus({ items }) {
    return (
        <div className="card panel">
            <h3><i className="pi pi-box" /> License Status <span className="lead">Monitor software license usage and expiry</span></h3>
            <div className="license-list">
                {items.map((it) => <LicenseItem key={it.id} {...it} />)}
            </div>
            <button className="manage-btn" aria-label="Manage Licenses">Manage Licenses</button>
        </div>
    );
}
