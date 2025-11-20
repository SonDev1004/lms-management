import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

import '../styles/roster.css';
const STATUS_META = {
    P: { label: "Present", icon: "pi pi-check-circle", cls: "status-P" },
    L: { label: "Late",    icon: "pi pi-clock",        cls: "status-L" },
    A: { label: "Absent",  icon: "pi pi-times-circle", cls: "status-A" },
    E: { label: "Excused", icon: "pi pi-exclamation-triangle", cls: "status-E" },
};
const STATUS_OPTIONS = Object.entries(STATUS_META).map(([value, m]) => ({ value, ...m }));

const REASON_OPTIONS = [
    "Illness",
    "Medical appointment",
    "Transportation delay",
    "Family emergency",
    "Technical issues",
    "Other",
];

const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function RosterTable({ students, onChange, selectedRow, onSelectRow }) {
    const valueTemplate = (value) => {
        const m = STATUS_META[value];
        return <span className={classNames("status-chip", m.cls)}><i className={m.icon} /> {m.label}</span>;
    };
    const itemTemplate = (opt) => (
        <div className={classNames("status-item", opt.cls)}><i className={opt.icon} /> {opt.label}</div>
    );

    return (
        <div className="attd-table">
            <div className="attd-thead">
                <div className="col-idx">#</div>
                <div className="col-student">Student</div>
                <div className="col-status">Status</div>
                <div className="col-late">Late Min</div>
                <div className="col-reason">Reason</div>
                <div className="col-note">Note</div>
                <div className="col-checkin">Check-in</div>
            </div>

            {students.map((s, idx) => {
                const isActive = idx === selectedRow;
                const needsReason = ["A", "E", "L"].includes(s.status);

                return (
                    <div
                        key={s.id}
                        className={classNames("attd-row", { "is-active": isActive })}
                        onClick={() => onSelectRow(idx)}
                    >
                        <div className="col-idx">{idx + 1}</div>

                        <div className="col-student">
                            <div className="avatar">{initials(s.name)}</div>
                            <div>
                                <div className="name">{s.name}</div>
                                <div className="code">{s.code}</div>
                            </div>
                        </div>

                        <div className="col-status">
                            <Dropdown
                                value={s.status}
                                options={STATUS_OPTIONS}
                                onChange={(e) => {
                                    const v = e.value;
                                    onChange(s.id, {
                                        status: v,
                                        lateMin: v === "L" ? (s.lateMin ?? 5) : null,
                                        reason: ["A", "E", "L"].includes(v) ? s.reason : "",
                                    });
                                }}
                                optionLabel="label"
                                optionValue="value"
                                valueTemplate={() => valueTemplate(s.status)}
                                itemTemplate={itemTemplate}
                                className="status-dd"
                                panelClassName="status-panel"
                            />
                        </div>

                        <div className="col-late">
                            <InputNumber
                                value={s.lateMin ?? null}
                                onValueChange={(e) => onChange(s.id, { lateMin: e.value })}
                                placeholder="-"
                                min={0}
                                max={120}
                                showButtons={false}      // gọn như mock
                                disabled={s.status !== "L"}
                                inputClassName="late-input"
                            />
                        </div>

                        <div className="col-reason">
                            <Dropdown
                                value={s.reason || ""}
                                options={REASON_OPTIONS}
                                onChange={(e) => onChange(s.id, { reason: e.value })}
                                placeholder="Select reason"
                                className="reason-dd"
                                panelClassName="reason-panel"
                                showClear={!!s.reason}    // chỉ hiện Clear khi đã chọn
                                disabled={!needsReason}
                            />
                        </div>

                        <div className="col-note">
                            <InputText
                                value={s.note || ""}
                                onChange={(e) => onChange(s.id, { note: e.target.value })}
                                placeholder="Add note..."
                            />
                        </div>

                        <div className="col-checkin">{s.checkIn || "-"}</div>
                    </div>
                );
            })}
        </div>
    );
}
