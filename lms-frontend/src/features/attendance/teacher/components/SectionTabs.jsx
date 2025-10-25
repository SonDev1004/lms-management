export default function SectionTabs({ active, onChange }) {
    const tabs = [
        { id: "today", label: "Today's Classes" },
        { id: "starred", label: "Starred" },
        { id: "recent", label: "Recent" },
    ];
    return (
        <div className="att-tabs">
            {tabs.map((t) => (
                <button
                    key={t.id}
                    className={`att-tab ${active === t.id ? "is-active" : ""}`}
                    onClick={() => onChange(t.id)}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}
