import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";

export default function ImageDropzone({
                                          value,
                                          onChange,
                                          accept = "image/*",
                                          maxSizeMB = 5,
                                          className = "",
                                      }) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if (value?.url?.startsWith("blob:")) URL.revokeObjectURL(value.url);
        };
    }, [value?.url]);

    const openPicker = () => inputRef.current?.click();

    const validate = (file) => {
        if (!file) return "No file selected.";
        const okType = accept.split(",").map(t => t.trim());
        const isAllowed =
            accept === "image/*" ? file.type.startsWith("image/") :
                okType.some(t => t === file.type || file.name.toLowerCase().endsWith(t.replace("image/","")));
        if (!isAllowed) return "Unsupported file type.";
        if (file.size > maxSizeMB * 1024 * 1024) return `File is larger than ${maxSizeMB}MB.`;
        return "";
    };

    const pick = (f) => {
        const err = validate(f);
        if (err) { setError(err); return; }
        setError("");
        const url = URL.createObjectURL(f);
        onChange?.({ url, name: f.name, size: f.size, type: f.type, file: f });
    };

    const onFiles = (files) => pick(files?.[0]);

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragOver(false);
        onFiles(e.dataTransfer.files);
    };

    const remove = () => {
        if (value?.url?.startsWith("blob:")) URL.revokeObjectURL(value.url);
        onChange?.(null);
    };

    if (value?.url) {
        return (
            <div className={`exb-img-preview ${className}`}>
                <img src={value.url} alt={value.name || "uploaded"} />
                <div className="exb-img-meta">
                    <div className="exb-img-name">{value.name}</div>
                    <div className="exb-img-actions">
                        <Button type="button" text icon="pi pi-refresh" label="Replace" onClick={openPicker}/>
                        <Button type="button" text severity="danger" icon="pi pi-times" label="Remove" onClick={remove}/>
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    style={{ display: "none" }}
                    onChange={(e) => onFiles(e.target.files)}
                />
                {error && <div className="exb-drop-err">{error}</div>}
            </div>
        );
    }

    return (
        <div
            className={`exb-dropzone ${dragOver ? "dragover" : ""} ${className}`}
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onKeyDown={(e)=> (e.key==="Enter" || e.key===" ") && openPicker()}
            onDragEnter={(e)=>{e.preventDefault(); setDragOver(true);}}
            onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
        >
            <span>Image (Optional) — Click to upload or drag and drop</span>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={(e)=>onFiles(e.target.files)}
                style={{ display:"none" }}
            />
            {error && <div className="exb-drop-err">{error}</div>}
        </div>
    );
}
