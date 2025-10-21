// items/ListeningFillEditor.jsx  (no Speed Control)
import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import ImageDropzone from "../common/ImageDropzone.jsx";

export default function ListeningFillEditor({ item, onChange }) {
    const blanks = item.blanks || [{ label: "Blank 1", answers: [""] }];

    const setBlankAns = (i, v) => {
        const arr = blanks.map((b, idx) =>
            idx === i ? { ...b, answers: v.split("\n") } : b
        );
        onChange({ blanks: arr });
    };

    const addBlank = () =>
        onChange({
            blanks: [...blanks, { label: `Blank ${blanks.length + 1}`, answers: [""] }],
        });

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

            {/* Blanks */}
            <div className="exb-subtitle">Fill in the Blanks</div>
            {blanks.map((b, i) => (
                <div key={i} className="exb-blank">
                    <div className="exb-blank-row">
                        <div className="exb-blank-title">{b.label}</div>
                        <div className="exb-blank-answers">
                            <label className="exb-mini">Acceptable Answers (one per line)</label>
                            <InputTextarea
                                rows={3}
                                placeholder="Enter acceptable answers, one per line"
                                value={(b.answers || []).join("\n")}
                                onChange={(e) => setBlankAns(i, e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <Button
                icon="pi pi-plus"
                label="Add Blank"
                outlined
                className="mt-2 exb-add-blank-left exb-align-to-col2"
                onClick={addBlank}
            />
        </div>
    );
}
``
