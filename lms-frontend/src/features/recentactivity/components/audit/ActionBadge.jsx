export default function ActionBadge({ action }) {
    const map = {
        "User Created": { bg:"#dcfce7", fg:"#14532d", icon:"pi pi-user-plus" },
        "License Assigned": { bg:"#d1fae5", fg:"#065f46", icon:"pi pi-box" },
        "Software Deployed": { bg:"#e5e7eb", fg:"#374151", icon:"pi pi-desktop" },
        "Password Reset": { bg:"#e0e7ff", fg:"#3730a3", icon:"pi pi-key" },
        "Role Updated": { bg:"#fee2e2", fg:"#7f1d1d", icon:"pi pi-shield" },
        "Policy Applied": { bg:"#fef9c3", fg:"#854d0e", icon:"pi pi-lock" },
        "User Disabled": { bg:"#fee2e2", fg:"#7f1d1d", icon:"pi pi-user-minus" },
        "Login Failed": { bg:"#ffedd5", fg:"#9a3412", icon:"pi pi-ban" },
        "Group Changed": { bg:"#e0f2fe", fg:"#075985", icon:"pi pi-users" },
    };
    const s = map[action] || { bg:"#e5e7eb", fg:"#374151", icon:"pi pi-info-circle" };
    return (
        <span style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"6px 12px", borderRadius:999, background:s.bg, color:s.fg, fontWeight:700
        }}>
      <i className={s.icon} />
      <span>{action}</span>
    </span>
    );
}
