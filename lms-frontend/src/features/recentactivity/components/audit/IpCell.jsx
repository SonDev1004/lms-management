export default function IpCell({ ip }) {
    const isNA = !ip || ip === "N/A";
    return (
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ color:isNA ? "#94a3b8" : "#0f172a", fontWeight:isNA ? 500 : 700 }}>
        {isNA ? "N/A" : ip}
      </span>
            {!isNA && <i className="pi pi-eye ip-eye" title="View location" />}
        </div>
    );
}
