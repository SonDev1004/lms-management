import { Tooltip } from "primereact/tooltip";
import CourseCard from "./CourseCard.jsx";

export default function CourseGrid({ items, loading, error }) {
    if (loading) return <div className="skeleton">Đang tải khoá học…</div>;
    if (error)   return <div className="error">Không tải được danh sách khoá học.</div>;
    if (!items?.length) return <div className="empty">Bạn chưa có khoá học nào.</div>;

    return (
        <div className="course-grid" role="list" aria-live="polite">
            <Tooltip target=".btn-tooltip" position="top" mouseTrack mouseTrackLeft={10} />
            {items.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
    );
}
