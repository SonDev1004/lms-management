export default function StatBadge({ icon, text }) {
    return (
        <span className="stat-badge">
      <i className={icon} style={{ fontSize: 15, color: '#335CFF' }} />
      <span style={{ fontWeight: 600 }}>{text}</span>
    </span>
    );
}
