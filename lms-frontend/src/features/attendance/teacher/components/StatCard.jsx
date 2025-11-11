import { Card } from "primereact/card";
import { classNames } from "primereact/utils";

export default function StatCard({ title, value, icon, tone = "neutral", withTrend = false }) {
    return (
        <Card className={classNames("att-stat", {
            "att-stat--success": tone === "success",
            "att-stat--students": tone === "students",
            "att-stat--neutral": tone === "neutral",
        })}>
            <div className="att-stat__iconbox"><i className={icon} /></div>
            <div className="att-stat__title">{title}</div>
            <div className="att-stat__value">
                {withTrend ? (
                    <span className="att-trend">
            {value} <i className="pi pi-arrow-up-right" />
          </span>
                ) : value}
            </div>
        </Card>
    );
}
