import React, { useMemo, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import Topbar from "../components/Topbar.jsx";
import LeftNav from "../components/LeftNav.jsx";
import InspectorPanel from "../components/InspectorPanel.jsx";
import DetailsStep from "../components/DetailsStep.jsx";
import ItemsStep from "../components/ItemsStep.jsx";
import SettingsStep from "../components/SettingsStep.jsx";
import ReviewPublishStep from "../components/ReviewPublishStep.jsx";

import "../styles/exercise.css";
import "../styles/tokens.css";
import "../styles/items.css";


export default function ExerciseBuilder() {
    const [step, setStep] = useState(0); // 0: Details, 1: Items, 2: Settings, 3: Review
    const [meta, setMeta] = useState({
        title: "Untitled Exercise",
        description: "",
        subject: "",
        unit: "",
        level: null,
        estMinutes: 30,
        status: "Draft",
    });

    const [items, setItems] = useState([]); // list of item objects
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [settings, setSettings] = useState(null);

    const toastRef = useRef(null);

    // TODO: plug in real validation rules later
    const validationPassed = useMemo(() => true, [meta, items, settings]);

    const handlePreview = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        toastRef.current?.show({
            severity: "info",
            summary: "Preview",
            detail: "Student preview is not wired yet (UI only).",
            life: 2000,
        });
    };

    const handleSave = () => {
        toastRef.current?.show({
            severity: "success",
            summary: "Saved",
            detail: `“${meta.title || "Untitled Exercise"}” has been saved.`,
            life: 2000,
        });
    };

    const handlePublish = () => {
        confirmDialog({
            message: "Publish this exercise? Students will be able to see it based on visibility settings.",
            header: "Confirm Publish",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Publish",
            rejectLabel: "Cancel",
            acceptClassName: "p-button",
            accept: () => {
                setMeta((m) => ({ ...m, status: "Published" }));
                toastRef.current?.show({
                    severity: "success",
                    summary: "Published",
                    detail: "Your exercise is now live.",
                    life: 2200,
                });
                setStep(3);
            },
        });
    };

    return (
        <div className="exb-shell">
            <Toast ref={toastRef} />
            <ConfirmDialog />

            <Topbar
                title={meta.title || "Untitled Exercise"}
                onPreview={handlePreview}
                onSave={handleSave}
                onPublish={handlePublish}
                status={meta.status}
            />

            <div className="exb-body">
                <LeftNav
                    step={step}
                    setStep={setStep}
                    itemsCount={items.length}
                    points={items.reduce((s, i) => s + (i.points || 0), 0)}
                />

                <main className="exb-main">
                    {step === 0 && <DetailsStep meta={meta} onChange={setMeta} />}

                    {step === 1 && (
                        <ItemsStep
                            items={items}
                            setItems={setItems}
                            selectedItemId={selectedItemId}
                            setSelectedItemId={setSelectedItemId}
                        />
                    )}

                    {step === 2 && (
                        <div className="p-card exb-card p-4">
                            <SettingsStep settings={settings} onChange={setSettings} />
                        </div>
                    )}

                    {step === 3 && <ReviewPublishStep meta={meta} items={items} />}
                </main>

                {/*<InspectorPanel*/}
                {/*    validationPassed={validationPassed}*/}
                {/*    selectedItem={items.find((i) => i.id === selectedItemId)}*/}
                {/*    onPatchItem={(patch) => {*/}
                {/*        setItems((prev) =>*/}
                {/*            prev.map((i) => (i.id === selectedItemId ? { ...i, ...patch } : i))*/}
                {/*        );*/}
                {/*    }}*/}
                {/*/>*/}
            </div>
        </div>
    );
}
