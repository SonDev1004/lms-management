import { formatNumber } from "../utils/format";

export default function MetricCard({ title, value, deltaText, deltaTone, icon }) {
    return (
        <div className="card kpi">
            <div className="meta">
                <div className="title">{title}</div>
                <div className="value">{formatNumber(value)}</div>
                <div className={`delta ${deltaTone === "negative" ? "bad" : "ok"}`}>{deltaText}</div>
            </div>
            <div className="ic">
                <i className={icon} />
            </div>
        </div>
    );
}
