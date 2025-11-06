// items/ListeningMcqEditor.jsx  (no Speed Control)
import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import ImageDropzone from "../common/ImageDropzone.jsx";

export default function ListeningMcqEditor({ item, onChange }) {
    const options = item.options || ["", ""];
    const setOption = (i, v) => {
        const arr = [...options];
        arr[i] = v;
        onChange({ options: arr });
    };

    return (
        <div className="exb-editor">
            {/* Prompt */}
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

            {/* Image */}
            <div className="exb-field">
                <ImageDropzone
                    value={item.image || null}
                    onChange={(img) => onChange({ image: img })}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={5}
                    className="exb-dropzone--thin"
                />
            </div>

            {/* Audio */}
            <div className="exb-subtitle">Audio</div>
            <div className="exb-aud-zone">
                <div className="exb-aud-cap">
                    <i className="pi pi-volume-up" />
                    Upload audio file or record
                </div>
                <div className="flex gap-2 justify-content-center">
                    <Button icon="pi pi-upload" label="Upload" className="exb-btn-primary" />
                    <Button icon="pi pi-microphone" label="Record" className="exb-btn-outline" />
                </div>
            </div>

            {/* Playback only */}
            <div className="mt-3">
                <label className="exb-label">Playback Limit</label>
                <InputNumber
                    value={item.playLimit ?? 2}
                    onValueChange={(e) => onChange({ playLimit: e.value })}
                />
            </div>

            {/* Transcript */}
            <div className="exb-field exb-transcript">
                <label className="exb-label">Transcript (Optional)</label>
                <InputTextarea
                    rows={3}
                    placeholder="Enter audio transcript for accessibility"
                    value={item.transcript || ""}
                    onChange={(e) => onChange({ transcript: e.target.value })}
                />
            </div>

            {/* Options */}
            <div className="exb-subtitle">Answer Options</div>
            {options.map((opt, idx) => (
                <div key={idx} className="exb-option">
                    <div className="exb-option-letter">{String.fromCharCode(65 + idx)}</div>
                    <RadioButton
                        name={`lm-${item.id}`}
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
                onClick={() => onChange({ options: [...options, ""] })}
                className="mt-2 exb-add-option"
            />
        </div>
    );
}
