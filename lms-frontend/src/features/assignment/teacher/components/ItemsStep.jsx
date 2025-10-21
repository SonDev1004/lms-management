import React, { useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";

import ItemCard from "./items/ItemCard.jsx";
import McqSingleEditor from "./items/McqSingleEditor.jsx";
import McqMultiEditor from "./items/McqMultiEditor.jsx";
import FillBlankEditor from "./items/FillBlankEditor.jsx";
import ListeningMcqEditor from "./items/ListeningMcqEditor.jsx";
import ListeningFillEditor from "./items/ListeningFillEditor.jsx";
import EssayEditor from "./items/EssayEditor.jsx";

let idSeq = 1;

const TYPE = {
    MCQ_SINGLE: "mcq_single",
    MCQ_MULTI: "mcq_multi",
    FILL: "fill",
    L_MCQ: "listening_mcq",
    L_FILL: "listening_fill",
    ESSAY: "essay",
};

const typeLabel = {
    [TYPE.MCQ_SINGLE]: "MCQ - Single Answer",
    [TYPE.MCQ_MULTI]: "MCQ - Multiple Answers",
    [TYPE.FILL]: "Fill in the Blank",
    [TYPE.L_MCQ]: "Listening MCQ",
    [TYPE.L_FILL]: "Listening Fill in Blank",
    [TYPE.ESSAY]: "Essay",
};

export default function ItemsStep({
                                      items,
                                      setItems,
                                      selectedItemId,
                                      setSelectedItemId,
                                  }) {
    const menuRef = useRef(null);

    const addItem = (t) => {
        const id = String(idSeq++);
        const base = {
            id,
            type: t,
            typeLabel: typeLabel[t],
            points: 1,
            required: true,
        };

        const extra =
            t === TYPE.MCQ_SINGLE || t === TYPE.MCQ_MULTI
                ? { options: ["", ""], correct: t === TYPE.MCQ_SINGLE ? 0 : [] }
                : t === TYPE.FILL || t === TYPE.L_FILL
                    ? { blanks: [{ label: "Blank 1", answers: [""] }] }
                    : t === TYPE.ESSAY
                        ? {
                            cfg: {
                                minWords: 150,
                                maxWords: 250,
                                maxChars: 2000,
                                rubric: "holistic",
                                sample: "",
                                showSample: false,
                            },
                        }
                        : {};

        const supportsShuffle = t === TYPE.MCQ_SINGLE || t === TYPE.MCQ_MULTI;

        const item = { ...base, supportsShuffle, ...extra };
        setItems((prev) => [...prev, item]);
        setSelectedItemId(id);
    };

    const menuModel = [
        { label: typeLabel[TYPE.MCQ_SINGLE], command: () => addItem(TYPE.MCQ_SINGLE) },
        { label: typeLabel[TYPE.MCQ_MULTI], command: () => addItem(TYPE.MCQ_MULTI) },
        { separator: true },
        { label: typeLabel[TYPE.FILL], command: () => addItem(TYPE.FILL) },
        { separator: true },
        { label: typeLabel[TYPE.L_MCQ], command: () => addItem(TYPE.L_MCQ) },
        { label: typeLabel[TYPE.L_FILL], command: () => addItem(TYPE.L_FILL) },
        { separator: true },
        { label: typeLabel[TYPE.ESSAY], command: () => addItem(TYPE.ESSAY) },
    ];

    const renderEditor = (it) => {
        const patch = (patchObj) =>
            setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, ...patchObj } : x)));

        switch (it.type) {
            case TYPE.MCQ_SINGLE:
                return <McqSingleEditor item={it} onChange={patch} />;
            case TYPE.MCQ_MULTI:
                return <McqMultiEditor item={it} onChange={patch} />;
            case TYPE.FILL:
                return <FillBlankEditor item={it} onChange={patch} />;
            case TYPE.L_MCQ:
                return <ListeningMcqEditor item={it} onChange={patch} />;
            case TYPE.L_FILL:
                return <ListeningFillEditor item={it} onChange={patch} />;
            case TYPE.ESSAY:
                return <EssayEditor item={it} onChange={patch} />;
            default:
                return null;
        }
    };

    return (
        <div className="exb-items">
            <div className="exb-items-head">
                <h2 className="exb-h2">Exercise Items</h2>
                <div>
                    <Button
                        icon="pi pi-plus"
                        label="Add Item"
                        className="exb-add-btn"
                        onClick={(e) => menuRef.current?.toggle(e)}
                    />
                    <Menu model={menuModel} popup ref={menuRef} />
                </div>
            </div>
            <p className="exb-section-sub">Create and manage your exercise questions</p>

            {items.length === 0 ? (
                <Card className="exb-empty p-5">
                    <div className="exb-empty-circle">
                        <i className="pi pi-plus" />
                    </div>
                    <div className="exb-empty-title">No items yet</div>
                    <div className="exb-empty-sub">
                        Start building your exercise by adding your first question
                    </div>
                    <Button
                        className="mt-3 exb-add-btn"
                        icon="pi pi-plus"
                        label="Add First Item"
                        onClick={(e) => menuRef.current?.toggle(e)}
                    />
                </Card>
            ) : (
                <div className="exb-item-stack">
                    {items.map((it, idx) => (
                        <ItemCard
                            key={it.id}
                            index={idx + 1}
                            item={it}
                            active={selectedItemId === it.id}
                            onSelect={() => setSelectedItemId(it.id)}
                            onDuplicate={() =>
                                setItems((prev) => {
                                    const copy = { ...it, id: String(idSeq++), typeLabel: it.typeLabel };
                                    return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)];
                                })
                            }
                            onDelete={() => setItems((prev) => prev.filter((x) => x.id !== it.id))}
                        >
                            {renderEditor(it)}
                        </ItemCard>
                    ))}
                </div>
            )}
        </div>
    );
}
