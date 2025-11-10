import QuickAction from "./QuickAction";

export default function QuickActionsPanel({ items }) {
    return (
        <div className="card panel">
            <h3><i className="pi pi-bolt" /> Quick Actions <span className="lead">Frequently used administrative tasks</span></h3>
            <div className="qa-list">
                {items.map((a) => <QuickAction key={a.id} {...a} />)}
            </div>
        </div>
    );
}
