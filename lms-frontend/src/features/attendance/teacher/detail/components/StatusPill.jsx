export default function StatusPill({ code = "P" }) {
    const map = {
        P: { text: "Present", icon: "pi pi-check-circle", cls: "is-present" },
        L: { text: "Absent", icon: "pi pi-exclamation-circle", cls: "is-absent" },
    };
    const m = map[code] || map.P;
    return (
        <span className={`attd-pill ${m.cls}`}>
      <i className={m.icon} />
      <span>{m.text}</span>
    </span>
    );
}
