import React from "react";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { Button } from "primereact/button";

export default function SettingsStep({ settings, onChange = () => {} }) {
    const s = {
        timerEnabled: false,
        attempts: 1,
        showCorrect: false,
        lockReview: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        ipLock: false,
        preventCopy: false,
        altRequired: true,
        transcriptRequired: false,
        schedule: null,
        sections: [],
        ...(settings || {}),
    };

    const set = (patch) => onChange({ ...s, ...patch });

    return (
        <div className="exb-settings">
            <h2 className="exb-h2">Exercise Settings</h2>
            <p className="exb-sub">
                Configure timing, attempts, randomization, and other exercise options
            </p>

            <div className="exb-settings-grid">
                {/* TIMER */}
                <Card className="exb-set-card">
                    <div className="exb-set-title">
                        <i className="pi pi-clock" />
                        <span>Timer</span>
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Enable Timer</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.timerEnabled}
                            onChange={(e) => set({ timerEnabled: e.value })}
                        />
                    </div>
                </Card>

                {/* ATTEMPTS */}
                <Card className="exb-set-card">
                    <div className="exb-set-title">
                        <i className="pi pi-refresh" />
                        <span>Attempts</span>
                    </div>

                    <label className="exb-label">Maximum Attempts</label>
                    <div className="exb-inline">
                        <InputNumber
                            value={s.attempts >= 99999 ? 1 : s.attempts}
                            onValueChange={(e) => set({ attempts: e.value || 1 })}
                            min={1}
                            useGrouping={false}
                            showButtons
                            buttonLayout="stacked"
                            incrementButtonIcon="pi pi-chevron-up"
                            decrementButtonIcon="pi pi-chevron-down"
                            inputClassName="exb-num"
                            className="exb-num-wrap"
                        />
                        <Button
                            type="button"
                            label="Unlimited"
                            outlined
                            className="exb-ghost-btn"
                            onClick={() => set({ attempts: 99999 })}
                        />
                    </div>

                    <div className="exb-prop-row jc-between mt-2">
                        <div className="exb-prop-label">Show correct answers after submit</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.showCorrect}
                            onChange={(e) => set({ showCorrect: e.value })}
                        />
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Lock review until teacher releases</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.lockReview}
                            onChange={(e) => set({ lockReview: e.value })}
                        />
                    </div>
                </Card>

                {/* RANDOMIZATION */}
                <Card className="exb-set-card">
                    <div className="exb-set-title">
                        <i className="pi pi-sliders-h" />
                        <span>Randomization</span>
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Shuffle questions</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.shuffleQuestions}
                            onChange={(e) => set({ shuffleQuestions: e.value })}
                        />
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Shuffle MCQ options</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.shuffleOptions}
                            onChange={(e) => set({ shuffleOptions: e.value })}
                        />
                    </div>
                </Card>

                {/* SECURITY */}
                <Card className="exb-set-card">
                    <div className="exb-set-title">
                        <i className="pi pi-shield" />
                        <span>Security</span>
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">IP address lock</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.ipLock}
                            onChange={(e) => set({ ipLock: e.value })}
                        />
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Prevent copy/paste</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.preventCopy}
                            onChange={(e) => set({ preventCopy: e.value })}
                        />
                    </div>
                </Card>

                {/* ACCESSIBILITY */}
                <Card className="exb-set-card">
                    <div className="exb-set-title">
                        <i className="pi pi-eye" />
                        <span>Accessibility</span>
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Require alt text for images</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.altRequired}
                            onChange={(e) => set({ altRequired: e.value })}
                        />
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Require audio transcripts</div>
                        <InputSwitch
                            className="exb-switch"
                            checked={s.transcriptRequired}
                            onChange={(e) => set({ transcriptRequired: e.value })}
                        />
                    </div>
                </Card>

                {/* VISIBILITY & ASSIGNMENT */}
                <Card className="exb-set-card">
                    <div className="exb-set-title">
                        <i className="pi pi-users" />
                        <span>Visibility &amp; Assignment</span>
                    </div>

                    <label className="exb-label">Publish Schedule (Optional)</label>
                    <div className="exb-inline ai-center">
                        <Calendar
                            value={s.schedule}
                            onChange={(e) => set({ schedule: e.value })}
                            showIcon
                            showTime
                            hourFormat="24"
                            placeholder="mm/dd/yyyy --:-- --"
                        />
                    </div>

                    <div className="mt-2">
                        <label className="exb-label">Assigned Sections/Classes</label>
                        <Chips
                            value={s.sections}
                            onChange={(e) => set({ sections: e.value })}
                            separator=","
                            placeholder="Add section or class name"
                        />
                    </div>
                </Card>
            </div>

            {/* SUMMARY */}
            <Card className="exb-summary mt-3">
                <div className="exb-summary-title">Settings Summary</div>
                <div className="exb-summary-line">
                    Timer: <b>{s.timerEnabled ? "Enabled" : "Disabled"}</b>
                </div>
                <div className="exb-summary-line">
                    Attempts: <b>{s.attempts >= 99999 ? "Unlimited" : s.attempts}</b>
                </div>
                <div className="exb-summary-line">
                    Randomization:{" "}
                    <b>{s.shuffleQuestions || s.shuffleOptions ? "Enabled" : "Disabled"}</b>
                </div>
                <div className="exb-summary-line">
                    Security: <b>{s.ipLock || s.preventCopy ? "Strict" : "Standard"}</b>
                </div>
            </Card>
        </div>
    );
}
