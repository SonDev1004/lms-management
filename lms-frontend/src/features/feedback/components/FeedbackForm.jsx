import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import RatingStars from "./RatingStars";
import '../styles/FeedbackForm.css';

const CATEGORIES = [
    { label: "Course", value: "Course" },
    { label: "Platform", value: "Platform" },
    { label: "General", value: "General" },
];

export default function FeedbackForm({ onSubmit }) {
    const [form, setForm] = useState({ title: "", message: "", rating: 0, category: "Course", subcategory: "", tags: "" });
    const toast = useRef(null);

    const submit = () => {
        if (!form.title.trim() || !form.message.trim()) {
            toast.current.show({ severity: "warn", summary: "Missing info", detail: "Please enter a title and message" });
            return;
        }
        const payload = {
            title: form.title.trim(),
            message: form.message.trim(),
            rating: form.rating,
            category: form.category,
            subcategory: form.subcategory || null,
            tags: form.tags
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
        };
        onSubmit?.(payload);
        setForm({ title: "", message: "", rating: 0, category: "Course", subcategory: "", tags: "" });
        toast.current.show({ severity: "success", summary: "Submitted", detail: "Thank you for your feedback!" });
    };

    return (
        <div className="fb-form">
            <Toast ref={toast} position="bottom-right" />
            <div className="fb-field">
                <label>Title</label>
                <InputText value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Short summary" />
            </div>
            <div className="fb-field">
                <label>Message</label>
                <InputTextarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your idea or issue…" autoResize rows={4} />
            </div>
            <div className="fb-row">
                <div className="fb-field">
                    <label>Rating</label>
                    <RatingStars value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                </div>
                <div className="fb-field">
                    <label>Category</label>
                    <Dropdown value={form.category} options={CATEGORIES} onChange={(e) => setForm({ ...form, category: e.value })} />
                </div>
                <div className="fb-field">
                    <label>Subcategory</label>
                    <InputText value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Optional" />
                </div>
            </div>
            <div className="fb-field">
                <label>Tags</label>
                <InputText value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Comma separated (e.g., ielts, ui)" />
            </div>
            <div className="fb-actions">
                <button className="fb-btn" onClick={submit}>Send feedback</button>
            </div>
        </div>
    );
}