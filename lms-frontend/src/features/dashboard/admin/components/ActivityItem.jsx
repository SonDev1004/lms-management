const tone = (status) => status === "success" ? "ok" : status === "warning" ? "warn" : "bad";

export default function ActivityItem({ status, title, detail, time }) {
    return (
        <div className="activity">
            <div className={`dot ${tone(status)}`} />
            <div className="body">
                <div className="title">{title}</div>
                <div className="detail">{detail}</div>
                <div className="time">{time}</div>
            </div>
            <i className="pi pi-check-circle" style={{color:"#10b981"}} hidden={status!=="success"} />
            <i className="pi pi-exclamation-circle" style={{color:"#f59e0b"}} hidden={status!=="warning"} />
        </div>
    );
}
