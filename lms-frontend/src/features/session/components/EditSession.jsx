import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

const EditSession = ({ session, onCancel, onSave }) => {
    const [draft, setDraft] = useState({
        //Mặc định là để theo hiển thị của DB/Mock
        description: session.description,
        date: session.date ? new Date(session.date) : null,
    });
    //Báo lỗi: 
    const [error, setError] = useState({});
    //Hợp thức hóa:
    const validate = () => {
        let err = {};
        if (!draft.description?.trim()) err.description = "Description cannot be empty";
        if (!draft.date) err.date = "Please select a date";
        setError(err);
        return Object.keys(err).length == 0;
    }
    //Lấy thay đổi từ chỉnh sửa:
    const getDiff = () => {
        const diff = {};
        const newDateStr = draft.date?.toISOString().slice(0, 10);
        const oldDateStr = typeof session.date === "string"
            ? session.date.slice(0, 10)
            : session.date?.toISOString().slice(0, 10);
        if (draft.description !== session.description)
            diff.description = { from: session.description, to: draft.description };
        if (newDateStr !== oldDateStr)
            diff.date = { from: oldDateStr, to: newDateStr };
        return diff;
    };

    //Lưu cập nhật:
    const handleSave = () => {
        if (!validate()) return;
        const changed = getDiff();
        if (Object.keys(changed).length === 0) {
            alert("No changes.");
            onCancel();
            return;
        }
        // Gọi callback cha
        onSave(session.id, changed, { ...draft });
    };
    return (
        <div className="grid p-2">
            <div className="col-12 md:col-4">
                <label className="block mb-2">Date</label>
                <Calendar
                    value={draft.date}
                    onChange={e => setDraft(d => ({ ...d, date: e.value }))}
                    showIcon dateFormat="dd/mm/yy"
                    className={error.date ? "p-invalid" : ""}
                />
                {error.date && <small className="p-error block">{error.date}</small>}
            </div>
            <div className="col-12 md:col-8">
                <label className="block mb-2">Content</label>
                <InputTextarea
                    value={draft.description}
                    onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                    rows={2}
                    className={error.description ? "p-invalid" : ""}
                />
                {error.description && <small className="p-error block">{error.description}</small>}
            </div>
            <div className="col-12 flex justify-content-end gap-2 mt-2">
                <Button label="Cancel" severity="secondary" outlined onClick={onCancel} />
                <Button label="Update" onClick={handleSave} />
            </div>
        </div>
    );
}

export default EditSession;