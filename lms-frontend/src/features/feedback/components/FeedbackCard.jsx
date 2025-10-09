import "../styles/FeedbackCard.css";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";

export default function FeedbackCard({
                                         row,
                                         onOpen,
                                         onReply,
                                         onResolve,
                                         onReview,
                                         onDelete,
                                     }) {
    if (!row) return null;

    const status = row.status ?? "Open";
    const statusClass =
        status === "Resolved" ? "fb-pill fb-pill--resolved" :
            status === "In Progress" ? "fb-pill fb-pill--progress" :
                status === "Archived" ? "fb-pill fb-pill--archived" :
                    "fb-pill fb-pill--open";

    const authorName = row.user?.name || "Anonymous";
    const category   = row.category || "General";
    const subcat     = row.subcategory ? ` • ${row.subcategory}` : "";
    const dt         = row.createdAt ? new Date(row.createdAt) : null;
    const title      = row.title || "(no title)";
    const message    = row.message || "";

    return (
        <article className="fb-card">
            <div className="fb-card__status"><span className={statusClass}>{status}</span></div>

            <header className="fb-card__head">
                <div className="fb-card__author">
                    <div className="fb-avatar">{authorName[0]}</div>
                    <div className="fb-author__meta">
                        <div className="fb-author__name">{authorName}</div>
                        <div className="fb-author__sub">{category}{subcat}</div>
                    </div>
                </div>

                {dt && (
                    <time className="fb-time">
                        {dt.toLocaleDateString()} {dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </time>
                )}
            </header>

            <h4 className="fb-card__title" onClick={() => onOpen?.(row)}>{title}</h4>
            {message && <p className="fb-card__msg">{message}</p>}

            <div className="fb-card__rating">
                <Rating value={row.rating ?? 0} readOnly cancel={false} />
            </div>

            <div className="fb-card__cats">
                {row.category && <span className="fb-chip">{row.category}</span>}
                {row.subcategory && <span className="fb-chip">{row.subcategory}</span>}
            </div>

            {!!row.tags?.length && (
                <div className="fb-card__tags">
                    {row.tags.map((t) => <span key={t} className="fb-hashtag">#{t}</span>)}
                </div>
            )}

            {!!row.replies?.length && (
                <div className="fb-replybox">
                    <div className="fb-replybox__label">Admin Reply</div>
                    <div className="fb-replybox__text">{row.replies[row.replies.length - 1]?.message || ""}</div>
                </div>
            )}

            <footer className="fb-actionsbar">
                <Button text icon="pi pi-comment" label="Reply" onClick={() => onReply?.(row)} className="fb-btn--ghost" />
                <div className="fb-actionsbar__spacer" />
                {status !== "Resolved" && (
                    <Button icon="pi pi-check-circle" label="Mark as Resolved" className="fb-btn--success" onClick={() => onResolve?.(row)} />
                )}
                {status !== "In Progress" && status !== "Resolved" && (
                    <Button icon="pi pi-check" label="Mark as Reviewed" className="fb-btn--primary" onClick={() => onReview?.(row)} />
                )}
                <Button icon="pi pi-trash" label="Delete" className="fb-btn--danger" onClick={() => onDelete?.(row)} />
            </footer>
        </article>
    );
}
