import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { Calendar } from "primereact/calendar";

const AddSession = ({ onCancel, onSave }) => {
    const [draft, setDraft] = useState({
        description: "",
        date: null,
    });
    //Bắt lỗi:
    const [error, setError] = useState({});
    const validate = () => {
        let err = {};
        if (!draft.description?.trim()) err.description = "Không được để trống";
        if (!draft.date) err.date = "Vui lòng chọn ngày";
        setError(err);
        return Object.keys(err).length === 0;
    };
    //Handle lưu 
    const handleSave = () => {
        if (!validate()) return;
        onSave({
            description: draft.description,
            date: draft.date,
        });
    };

    return (<div className="mb-3 p-3 shadow-4">
        <div className="grid">
            <div className="col-4 md:col-4">
                <label className="block mb-2">Lựa chọn ngày</label>
                <Calendar
                    value={draft.date}
                    onChange={e => setDraft(d => ({ ...d, date: e.value }))}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className={error.date ? "p-invalid" : ""}
                />
                {error.date && <small className="p-error block">{error.date}</small>}
            </div>
            <div className="col-8">
                <label className="block mb-2">Nội dung buổi học</label>
                <InputTextarea
                    value={draft.description}
                    onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                    className={error.description ? "p-invalid" : ""}
                />
                {error.description && <small className="p-error block">{error.description}</small>}
            </div>
            <div className="col-12 mt-3 flex justify-content-end gap-2">
                <Button label="Huỷ" severity="secondary" outlined onClick={onCancel} />
                <Button label="Lưu buổi học" icon="pi pi-check" onClick={handleSave} />
            </div>
        </div>
    </div>);
}

export default AddSession;