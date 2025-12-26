import { useEffect, useState, useMemo } from "react";
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

const FACTOR_BY_TYPE = {
    QUIZ_PHASE: 1,
    MID_TEST: 3,
    FINAL_TEST: 5,
};

const MAX_SCORE_FIXED = 10;

function normalizeTypeToArray(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return [raw];
}

export default function TeacherAssignmentForm({
                                                  defaultValues,
                                                  onSubmit,
                                                  onCancel,
                                                  submitting,
                                              }) {
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState(null);

    // cố định theo rule
    const [maxScore, setMaxScore] = useState(MAX_SCORE_FIXED);
    const [factor, setFactor] = useState(FACTOR_BY_TYPE.QUIZ_PHASE);

    // BE đang lấy getFirst() => FE ép 1 phần tử
    const [assignmentType, setAssignmentType] = useState([]);
    const [isActive, setIsActive] = useState(true);

    const selectedType = useMemo(() => {
        return assignmentType?.[0] || null;
    }, [assignmentType]);

    useEffect(() => {
        if (!defaultValues) {
            // create mới: set default Quiz
            setTitle("");
            setDueDate(null);
            setAssignmentType([]);
            setMaxScore(MAX_SCORE_FIXED);
            setFactor(FACTOR_BY_TYPE.QUIZ_PHASE);
            setIsActive(true);
            return;
        }

        setTitle(defaultValues.title || "");
        setDueDate(defaultValues.dueDate ? new Date(defaultValues.dueDate) : null);

        // maxScore luôn = 10 theo rule
        setMaxScore(MAX_SCORE_FIXED);

        const types = normalizeTypeToArray(defaultValues.assignmentType);
        const t0 = types[0] || null;

        // ép 1 type
        setAssignmentType(t0 ? [t0] : []);

        // factor sync theo type (ưu tiên rule)
        if (t0 && FACTOR_BY_TYPE[t0] != null) {
            setFactor(FACTOR_BY_TYPE[t0]);
        } else {
            setFactor(
                defaultValues.factor != null ? Number(defaultValues.factor) || 1 : 1
            );
        }

        setIsActive(
            typeof defaultValues.isActive === "boolean"
                ? defaultValues.isActive
                : true
        );
    }, [defaultValues]);

    const handleTypeChange = (e) => {
        const nextArr = Array.isArray(e.value) ? e.value : [];
        // lấy cái mới nhất user vừa chọn, và ép chỉ 1 type
        const picked = nextArr.length ? [nextArr[nextArr.length - 1]] : [];
        const t0 = picked[0] || null;

        setAssignmentType(picked);

        if (t0 && FACTOR_BY_TYPE[t0] != null) {
            setFactor(FACTOR_BY_TYPE[t0]);
        }

        // luôn fix 10 theo rule
        setMaxScore(MAX_SCORE_FIXED);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            id: defaultValues?.id ?? null,
            title: title?.trim(),
            maxScore: MAX_SCORE_FIXED, // fix
            factor: selectedType ? FACTOR_BY_TYPE[selectedType] : Number(factor) || 1,
            dueDate: dueDate ? dueDate.toISOString() : null,
            // giữ format array để tương thích code hiện tại
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                    min={10}
                    max={10}
                    disabled // khóa theo rule
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
                    min={1}
                    max={5}
                    disabled // khóa theo rule, auto theo type
                />
            </div>

            <div className="field col-12 md:col-8">
                <label className="font-semibold">Assignment type</label>
                <MultiSelect
                    value={assignmentType}
                    options={assignmentTypeOptions}
                    onChange={handleTypeChange}
                    placeholder="Choose type(s)"
                    display="chip"
                    disabled={submitting}
                />
                <small className="text-muted-color">
                    Rule: Quiz x4 (factor=1), Mid x1 (factor=3), Final x1 (factor=5).
                </small>
            </div>

            <div className="field col-12 md:col-4 flex align-items-center gap-2 mt-4">
                <Checkbox
                    inputId="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.checked)}
                    disabled={submitting}
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
