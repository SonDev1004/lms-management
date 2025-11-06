import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import ImageDropzone from "../common/ImageDropzone.jsx";

export default function FillBlankEditor({ item, onChange }) {
    const blanks = item.blanks || [{ label: "Blank 1", answers: [""] }];

    const setPrompt = (v) => onChange({ prompt: v });

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
                    onChange={(e) => setPrompt(e.target.value)}
                />
            </div>

            {/* Image dropzone (thin dashed style) */}
            <div className="exb-field">
                <ImageDropzone
                    value={item.image || null}
                    onChange={(img) => onChange({ image: img })}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={5}
                    className="exb-dropzone--thin"
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

            {/* Add Blank – pill, căn theo cột phải cho khớp mock */}
            <Button
                icon="pi pi-plus"
                label="Add Blank"
                outlined
                className="mt-2 exb-add-blank-left exb-align-to-col2"
                onClick={addBlank}
            />

            {/* Toggles vuông */}
        </div>
    );
}
