export default function QuickAction({ icon, label, description, intent }) {
    return (
        <div className="qa">
            <div className="qa-ic" style={intent === "primary" ? { background: "#dbeafe" } : undefined}>
                <i className={icon} />
            </div>
            <div className="qa-main">
                <div className="qa-title">{label}</div>
                <div className="qa-desc">{description}</div>
            </div>
            <i className="pi pi-angle-right" style={{color:"#94a3b8"}} />
        </div>
    );
}
