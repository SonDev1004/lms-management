import { Tooltip } from "primereact/tooltip";
import CourseCard from "./CourseCard.jsx";

export default function CourseGrid({ items, loading, error }) {
    if (loading) return <div className="skeleton">Loading courses…</div>;
    if (error) return <div className="error">Failed to load course list.</div>;
    if (!items?.length) return <div className="empty">You don't have any courses yet.</div>;

    return (
        <div className="course-grid" role="list" aria-live="polite">
            <Tooltip target=".btn-tooltip" position="top" mouseTrack mouseTrackLeft={10} />
            {items.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
    );
}
