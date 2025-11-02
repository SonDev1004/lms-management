import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Chips } from "primereact/chips";
import { ToggleButton } from "primereact/togglebutton";

export default function InspectorPanel({validationPassed=true, selectedItem, onPatchItem}) {
    return (
        <aside className="exb-inspector">
            <Card className="exb-val-card" title="Inspector & Validation">
                <div className="exb-validate">
                    <i className="pi pi-info-circle mr-2"/>
                    <div className="exb-val-text">
                        <div className="exb-val-title">Validation</div>
                        <div className={`exb-val-pass ${validationPassed?'ok':''}`}>
                            {validationPassed ? "All checks passed" : "Fix blocking issues"}
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="exb-qa-card" title="Quick Actions">
                <div className="exb-qa-col">
                    <Button label="Import from Bank" outlined/>
                    <Button label="Bulk Edit Items" outlined className="mt-2"/>
                    <Button label="Export Exercise" outlined className="mt-2"/>
                </div>
            </Card>

            {selectedItem && (
                <Card className="exb-props-card" title="Item Properties">
                    <div className="exb-prop-row">
                        <div className="exb-prop-label">Type</div>
                        <div className="exb-prop-value">{selectedItem.typeLabel}</div>
                    </div>

                    <div className="exb-prop-row">
                        <div className="exb-prop-label">Points</div>
                        <InputNumber value={selectedItem.points||1} min={0}
                                     onValueChange={(e)=>onPatchItem({points: e.value})} />
                    </div>

                    <div className="exb-prop-row jc-between">
                        <div className="exb-prop-label">Required</div>
                        <ToggleButton onLabel="" offLabel=""
                                      checked={!!selectedItem.required}
                                      onChange={(e)=>onPatchItem({required: e.value})}/>
                    </div>

                    {selectedItem.supportsShuffle && (
                        <div className="exb-prop-row jc-between">
                            <div className="exb-prop-label">Shuffle Options</div>
                            <ToggleButton onLabel="" offLabel=""
                                          checked={!!selectedItem.shuffle}
                                          onChange={(e)=>onPatchItem({shuffle: e.value})}/>
                        </div>
                    )}

                    <div className="exb-prop-row">
                        <div className="exb-prop-label">Tags</div>
                        <Chips value={selectedItem.tags||[]}
                               onChange={(e)=>onPatchItem({tags:e.value})}
                               separator="," />
                    </div>
                </Card>
            )}
        </aside>
    );
}
