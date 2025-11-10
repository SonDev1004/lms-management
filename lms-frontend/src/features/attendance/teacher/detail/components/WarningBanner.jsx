export default function WarningBanner({ icon = "pi pi-info-circle", text }) {
    return (
        <div className="attd-banner">
            <i className={icon} />
            <span>{text}</span>
        </div>
    );
}
