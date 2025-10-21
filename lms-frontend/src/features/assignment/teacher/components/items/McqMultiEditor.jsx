import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import ImageDropzone from "../common/ImageDropzone.jsx";

export default function McqMultiEditor({ item, onChange }) {
    const options = item.options || ["", ""];
    const correct = new Set(item.correct || []);

    const setOption = (i, v) => {
        const arr = [...options];
        arr[i] = v;
        onChange({ options: arr });
    };

    const toggleCorrect = (i) => {
        const s = new Set(correct);
        s.has(i) ? s.delete(i) : s.add(i);
        onChange({ correct: Array.from(s) });
    };

    return (
        <div className="exb-editor">
            <div className="exb-field">
                <label className="exb-label">
                    Question Prompt <span>*</span>
                </label>
                <InputTextarea
                    rows={3}
                    placeholder="Enter your question or prompt here..."
                    value={item.prompt || ""}
                    onChange={(e) => onChange({ prompt: e.target.value })}
                />
            </div>

            <div className="exb-field">
                <ImageDropzone
                    value={item.image || null}
                    onChange={(img) => onChange({ image: img })}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={5}
                />
            </div>

            <div className="exb-subtitle">Answer Options</div>
            {options.map((opt, idx) => (
                <div key={idx} className="exb-option">
                    <div className="exb-option-letter">{String.fromCharCode(65 + idx)}</div>
                    <Checkbox
                        inputId={`cb-${item.id}-${idx}`}
                        checked={correct.has(idx)}
                        onChange={() => toggleCorrect(idx)}
                    />
                    <InputText
                        className="exb-option-input"
                        placeholder="Enter option text"
                        value={opt}
                        onChange={(e) => setOption(idx, e.target.value)}
                    />
                </div>
            ))}

            <Button
                icon="pi pi-plus"
                label="Add Option"
                outlined
                onClick={() => onChange({ options: [...options, ""] })}
                className="mt-2 exb-add-option"
            />

            <div className="exb-subtitle mt-4">Scoring Policy</div>
            <div className="exb-radio-row">
                <RadioButton
                    inputId={`sp1-${item.id}`}
                    name={`score-${item.id}`}
                    value="all"
                    onChange={(e) => onChange({ scoring: e.value })}
                    checked={(item.scoring || "all") === "all"}
                />
                <label htmlFor={`sp1-${item.id}`}>All or Nothing</label>
            </div>
            <div className="exb-radio-row">
                <RadioButton
                    inputId={`sp2-${item.id}`}
                    name={`score-${item.id}`}
                    value="partial"
                    onChange={(e) => onChange({ scoring: e.value })}
                    checked={item.scoring === "partial"}
                />
                <label htmlFor={`sp2-${item.id}`}>Partial Credit</label>
            </div>
        </div>
    );
}
