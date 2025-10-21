import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import ImageDropzone from "../common/ImageDropzone.jsx";

export default function McqSingleEditor({ item, onChange }) {
    const options = item.options || ["", ""];
    const setPrompt = (v) => onChange({ prompt: v });

    const setOption = (i, v) => {
        const arr = [...options];
        arr[i] = v;
        onChange({ options: arr });
    };

    const addOption = () => onChange({ options: [...options, ""] });

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
                    onChange={(e) => setPrompt(e.target.value)}
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
                    <RadioButton
                        name={`mcq-${item.id}`}
                        value={idx}
                        onChange={(e) => onChange({ correct: e.value })}
                        checked={item.correct === idx}
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
                onClick={addOption}
                className="mt-2 exb-add-option"
            />
        </div>
    );
}
