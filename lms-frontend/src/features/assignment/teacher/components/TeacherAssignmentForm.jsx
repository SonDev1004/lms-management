import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

const assignmentTypeOptions = [
    { label: "Quiz phase", value: "QUIZ_PHASE" },
    { label: "Mid test", value: "MID_TEST" },
    { label: "Final test", value: "FINAL_TEST" },
];

export default function TeacherAssignmentForm({
                                                  defaultValues,
                                                  onSubmit,
                                                  onCancel,
                                                  submitting,
                                              }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const [maxScore, setMaxScore] = useState(10);
    const [factor, setFactor] = useState(1);
    const [assignmentType, setAssignmentType] = useState([]);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!defaultValues) return;
        setTitle(defaultValues.title || "");
        setDueDate(defaultValues.dueDate ? new Date(defaultValues.dueDate) : null);
        setMaxScore(
            defaultValues.maxScore
                ? Number(defaultValues.maxScore)
                : 10
        );
        setFactor(defaultValues.factor || 1);
        setAssignmentType(defaultValues.assignmentType || []);
        setIsActive(
            typeof defaultValues.isActive === "boolean"
                ? defaultValues.isActive
                : true
        );
    }, [defaultValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            id: defaultValues?.id ?? null,
            title: title?.trim(),
            maxScore: Number(maxScore) || 10,
            factor: Number(factor) || 1,
            dueDate: dueDate ? dueDate.toISOString() : null,
            assignmentType: assignmentType,
            isActive: isActive,
            sessionId: defaultValues?.sessionId ?? null,
        };
        onSubmit && onSubmit(payload);
    };

    return (
        <form className="grid formgrid p-fluid" onSubmit={handleSubmit}>
            <div className="field col-12">
                <label htmlFor="title" className="font-semibold">
                    Title
                </label>
                <InputText
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div className="field col-12 md:col-6">
                <label htmlFor="dueDate" className="font-semibold">
                    Due date
                </label>
                <Calendar
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.value)}
                    showTime
                    showSeconds={false}
                    hourFormat="24"
                />
            </div>

            <div className="field col-6 md:col-3">
                <label htmlFor="maxScore" className="font-semibold">
                    Max score
                </label>
                <InputNumber
                    id="maxScore"
                    value={maxScore}
                    onValueChange={(e) => setMaxScore(e.value)}
                    min={1}
                    max={100}
                />
            </div>

            <div className="field col-6 md:col-3">
                <label htmlFor="factor" className="font-semibold">
                    Factor
                </label>
                <InputNumber
                    id="factor"
                    value={factor}
                    onValueChange={(e) => setFactor(e.value)}
                    min={0}
                    max={10}
                    step={0.1}
                />
            </div>

            <div className="field col-12 md:col-8">
                <label className="font-semibold">Assignment type</label>
                <MultiSelect
                    value={assignmentType}
                    options={assignmentTypeOptions}
                    onChange={(e) => setAssignmentType(e.value)}
                    placeholder="Choose type(s)"
                    display="chip"
                />
            </div>

            <div className="field col-12 md:col-4 flex align-items-center gap-2 mt-4">
                <Checkbox
                    inputId="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.checked)}
                />
                <label htmlFor="isActive">Active</label>
            </div>

            <div className="col-12 flex justify-content-end gap-2 mt-3">
                <Button
                    type="button"
                    label="Cancel"
                    outlined
                    onClick={onCancel}
                    disabled={submitting}
                />
                <Button
                    type="submit"
                    label={submitting ? "Saving..." : "Save"}
                    icon="pi pi-check"
                    disabled={submitting}
                />
            </div>
        </form>
    );
}

TeacherAssignmentForm.propTypes = {
    defaultValues: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitting: PropTypes.bool,
};
