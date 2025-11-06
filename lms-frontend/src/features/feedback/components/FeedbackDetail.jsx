import { Dialog } from "primereact/dialog";
import RatingStars from "./RatingStars";
import { useState } from "react";
import '../styles/FeedbackDetail.css';
export default function FeedbackDetail({ value, visible, onHide, onReply, onStatus }) {
    const [reply, setReply] = useState("");
    if (!value) return null;

    return (
        <Dialog header="Feedback detail" visible={visible} style={{ width: "720px" }} modal onHide={onHide} className="fb-detail">
            <div className="fb-detail__head">
                <div>
                    <h3 className="fb-detail__title">{value.title}</h3>
                    <div className="fb-detail__meta">
                        <span>{value.user.name}</span>
                        <span>•</span>
                        <span>{new Date(value.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <div className="fb-detail__rating"><RatingStars value={value.rating} readOnly /></div>
            </div>

            <p className="fb-detail__msg">{value.message}</p>

            <div className="fb-detail__section">
                <h4>Conversation</h4>
                <div className="fb-thread">
                    {(value.replies || []).map((m) => (
                        <div key={m.id} className="fb-msg">
                            <div className="fb-msg__author">{m.author.name}</div>
                            <div className="fb-msg__text">{m.message}</div>
                            <div className="fb-msg__time">{new Date(m.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                    {!value.replies?.length && <div className="fb-empty">No replies yet.</div>}
                </div>
                <div className="fb-reply">
                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply to the user…" />
                    <div className="fb-gap">
                        <button className="fb-btn fb-btn--ghost" onClick={() => onStatus?.("Resolved")}>Mark as Resolved</button>
                        <button className="fb-btn" onClick={() => { if (!reply.trim()) return; onReply?.(reply.trim()); setReply(""); }}>Send reply</button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}