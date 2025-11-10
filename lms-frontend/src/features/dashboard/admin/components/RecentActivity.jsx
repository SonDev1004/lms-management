import ActivityItem from "./ActivityItem";

export default function RecentActivity({ items }) {
    return (
        <div className="card panel">
            <h3><i className="pi pi-clock" /> Recent Activity</h3>
            <div className="activity-list">
                {items.map((it) => <ActivityItem key={it.id} {...it} />)}
            </div>
            <button className="manage-btn" aria-label="View All Activity">
                View All Activity
            </button>
        </div>
    );
}
