import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { currencyRange } from "@/features/home/utils/format";
import "../styles/subject-card.css";

export default function SubjectCard({ subject }) {
    const navigate = useNavigate();
    const id = subject?.id ?? "";
    const img = subject?.image || "/noimg.png";
    const title = subject?.title || "Untitled subject";
    const desc = subject?.description?.trim() || "No description available.";
    const active = !!subject?.isActive;

    const price =
        subject?.tuitionMin || subject?.tuitionMax
            ? currencyRange(subject?.tuitionMin, subject?.tuitionMax)
            : null;

    const goDetail = () => navigate(`/subjects/${id}`);

    return (
        <article className="subject-card" role="article">
            {/* Ảnh — click đi chi tiết */}
            <button className="subject-card__media" onClick={goDetail} aria-label={`Xem ${title}`}>
                <img src={img} alt={title} loading="lazy" />
            </button>

            <div className="subject-card__body">
                <div className="subject-card__row">
                    {/* Tiêu đề — cũng link sang chi tiết */}
                    <Link to={`/subjects/${id}`} className="subject-card__title" title={title}>
                        {title}
                    </Link>
                    {price && <span className="subject-card__price">Từ {price}</span>}
                </div>

                <p className="subject-card__desc">{desc}</p>

                <div className="subject-card__foot">
                    <Tag value={active ? "Đang mở" : "Tạm dừng"} severity={active ? "success" : "warning"} />
                    <Button
                        label="Xem chi tiết"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        className="subject-card__cta"
                        onClick={goDetail}
                    />
                </div>
            </div>
        </article>
    );
}
