import React from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { ToggleButton } from "primereact/togglebutton";
import ImageDropzone from "../common/ImageDropzone.jsx";
import "../../styles/exb-essay.css";

export default function EssayEditor({ item, onChange }) {
    const cfg = item.cfg || {
        minWords: 150,
        maxWords: 250,
        maxChars: 2000,
        rubric: "holistic",
        sample: "",
        showSample: false,
    };

    const patchCfg = (p) => onChange({ cfg: { ...cfg, ...p } });

    return (
        <div className="exb-editor exb-essay">
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

            {/* Image – dashed thin box */}
            <div className="exb-field">
                <ImageDropzone
                    value={item.image || null}
                    onChange={(img) => onChange({ image: img })}
                    accept="image/png,image/jpeg,image/webp"
                    maxSizeMB={5}
                    className="exb-dropzone--thin"
                />
            </div>

            {/* Config */}
            <div className="exb-subtitle">Essay Configuration</div>

            <div className="exb-essay-grid">
                <div className="exb-field">
                    <label className="exb-label">Min Words</label>
                    <InputNumber
                        value={cfg.minWords}
                        min={0}
                        onValueChange={(e) => patchCfg({ minWords: e.value })}
                    />
                </div>

                <div className="exb-field">
                    <label className="exb-label">Max Words</label>
                    <InputNumber
                        value={cfg.maxWords}
                        min={0}
                        onValueChange={(e) => patchCfg({ maxWords: e.value })}
                    />
                </div>
            </div>

            <div className="exb-field">
                <label className="exb-label">Max Characters</label>
                <InputNumber
                    value={cfg.maxChars}
                    min={0}
                    onValueChange={(e) => patchCfg({ maxChars: e.value })}
                />
            </div>

            <div className="exb-essay-rubric">
                <div className="exb-label mb-2">Rubric Type</div>

                <div className="exb-radio-row">
                    <RadioButton
                        inputId={`rb-h-${item.id}`}
                        name={`rubric-${item.id}`}
                        value="holistic"
                        onChange={(e) => patchCfg({ rubric: e.value })}
                        checked={cfg.rubric === "holistic"}
                    />
                    <label htmlFor={`rb-h-${item.id}`}>Holistic (0–9)</label>
                </div>

                <div className="exb-radio-row">
                    <RadioButton
                        inputId={`rb-c-${item.id}`}
                        name={`rubric-${item.id}`}
                        value="custom"
                        onChange={(e) => patchCfg({ rubric: e.value })}
                        checked={cfg.rubric === "custom"}
                    />
                    <label htmlFor={`rb-c-${item.id}`}>Custom Rubric</label>
                </div>
            </div>

            <div className="exb-field">
                <label className="exb-label">Sample Answer (Optional)</label>
                <InputTextarea
                    rows={4}
                    placeholder="Provide a sample answer or guidance"
                    value={cfg.sample}
                    onChange={(e) => patchCfg({ sample: e.target.value })}
                />
            </div>
        </div>
    );
}
