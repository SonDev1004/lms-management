import "../styles/StatsBar.css";

export default function StatsBar({ stats }) {
    const Tile = ({ title, value, note, className, icon, badge }) => (
        <div className={`fb-stat ${className || ""}`}>
            <div className="fb-stat__content">
                <div className="fb-stat__title">{title}</div>
                <div className="fb-stat__value">{value}</div>
                {note && <div className="fb-stat__note">{note}</div>}
            </div>
            {icon && <div className="fb-stat__icon" aria-hidden>{icon}</div>}
            {badge && <span className="fb-stat__badge">{badge}</span>}
        </div>
    );

    return (
        <div className="fb-stats">
            <Tile
                title="Total Feedback"
                value={stats.total}
                className="fb-stat--blue"
                icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9Z"
                              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                }
            />
            <Tile
                title="Average Rating"
                value={stats.avg.toFixed(1)}
                note="★"
                className="fb-stat--amber"
                icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M3 17l6-6 4 4 7-7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14 4h7v7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                }
            />
            <Tile
                title="Open Issues"
                value={stats.open}
                className="fb-stat--red"
                badge="Pending"
            />
            <Tile
                title="Resolved"
                value={stats.resolved}
                className="fb-stat--green"
                icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M8 13l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M4 20a8 8 0 1 1 16 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                }
            />
        </div>
    );
}
