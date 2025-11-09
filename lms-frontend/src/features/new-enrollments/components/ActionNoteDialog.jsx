import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

export default function ActionNoteDialog({
                                             visible,
                                             title = "Confirm",
                                             onHide,
                                             onConfirm,
                                             loading = false,
                                             mode,
                                         }) {
    const [note, setNote] = useState("");
    const intent = mode ?? (title.toLowerCase().includes("reject") ? "reject" : "approve");

    const handleConfirm = async () => {
        try {
            await onConfirm?.(note);
            setNote("");
        } catch {
        }
    };

    const footer = (
        <div>
            <Button
                label="Cancel"
                className="ne-btn-cancel"
                onClick={() => { setNote(""); onHide?.(); }}
                disabled={loading}
            />
            <Button
                label="Confirm"
                className={`ne-btn-confirm ${intent === "reject" ? "reject" : "approve"}`}
                onClick={handleConfirm}
                loading={loading}
                disabled={loading}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            onHide={() => { setNote(""); onHide?.(); }}
            header={title}
            className="ne-dialog"
            dismissableMask
            draggable={false}
            closable
            footer={footer}
            breakpoints={{ "960px": "60vw", "640px": "90vw" }}
            style={{ width: 720, maxWidth: "92vw" }}
        >
            <p style={{ margin: "0 0 10px", color: "#334155" }}>
                Are you sure you want to {intent} enrollment?
            </p>
            <InputTextarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter a note for this action..."
                rows={6}
                className="w-full"
            />
        </Dialog>
    );
}
