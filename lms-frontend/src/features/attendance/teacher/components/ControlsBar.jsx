import { Button } from "primereact/button";

export default function ControlsBar({ layout, onLayoutChange, onFilter }) {
    const isList = layout === "list";
    return (
        <div className="att-controls">
            <div className="att-views">
                <Button
                    rounded
                    severity={isList ? "primary" : "secondary"}
                    outlined={!isList}
                    icon="pi pi-list"
                    onClick={() => onLayoutChange("list")}
                    aria-label="List view"
                    className={isList ? "is-active" : ""}
                />
                <Button
                    rounded
                    severity={!isList ? "primary" : "secondary"}
                    outlined={isList}
                    icon="pi pi-th-large"
                    onClick={() => onLayoutChange("grid")}
                    aria-label="Grid view"
                />
            </div>

            <Button
                icon="pi pi-filter"
                label="Filters"
                outlined
                onClick={onFilter}
            />
        </div>
    );
}
