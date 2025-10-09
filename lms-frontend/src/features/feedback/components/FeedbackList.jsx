import "../styles/FeedbackList.css";
import FeedbackCard from "./FeedbackCard";
import { Skeleton } from "primereact/skeleton";

export default function FeedbackList({ rows = [], loading, onOpen, onQuick }) {
    if (loading) {
        return (
            <div className="fb-grid">
                {(rows || []).filter(Boolean).map((it) => (
                    <FeedbackCard
                        key={it.id ?? Math.random()}
                        row={it}
                        onOpen={onOpen}
                        onReply={() => onQuick?.("reply", it)}
                        onResolve={() => onQuick?.("status", it, "Resolved")}
                        onReview={() => onQuick?.("status", it, "In Progress")}
                        onDelete={() => onQuick?.("delete", it)}
                    />
                ))}
            </div>
        );
    }

    if (!rows.length) return <div className="fb-empty">No feedback yet.</div>;

    return (
        <div className="fb-grid">
            {rows.map((it) => (
                <FeedbackCard
                    key={it.id}
                    row={it}
                    onOpen={onOpen}
                    onReply={() => onQuick?.("reply", it)}
                    onResolve={() => onQuick?.("status", it, "Resolved")}
                    onReview={() => onQuick?.("status", it, "In Progress")}
                    onDelete={() => onQuick?.("delete", it)}
                />
            ))}
        </div>
    );
}
