import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";

const StatusPill = ({ status, hidden }) => (
    <span className={`att-status ${hidden ? "is-hidden" : ""}`}>
    <i className="pi pi-clock" />
    <span>{status}</span>
  </span>
);

export default function ClassCard({ data, onToggleStar, layout = "grid" }) {
    const navigate = useNavigate();
    const {
        id,
        title,
        code,
        time,
        room,
        location,
        domain,
        level,
        campus,
        tags = [],
        enrolled,
        totalCap,
        attendanceRate,
        status = "Scheduled",
        starred,
    } = data;

    const goDetail = () => {
        navigate(`/teacher/attendance/detail/${id}`, {
            state: { classData: data, fromAttendance: "/teacher/attendance" },
        });
    };

    return (
        <Card className="att-class">
            <div className="att-class__head">
                <div className="att-class__title">
                    <h3>{title}</h3>
                    <button
                        className={`att-star ${starred ? "is-on" : ""}`}
                        onClick={onToggleStar}
                        aria-label="Toggle star"
                        title="Star"
                    >
                        <i className={starred ? "pi pi-star-fill" : "pi pi-star"} />
                    </button>
                </div>
                <StatusPill status={status} />
            </div>

            <div className="att-class__meta">
        <span className="att-line">
          <i className="pi pi-hashtag" /> {code}
        </span>
                <span className="att-line">
          <i className="pi pi-clock" /> {time}
        </span>
                <span className="att-line">
          <i className="pi pi-map-marker" /> {room || location}
        </span>
            </div>

            <div className="att-class__tags">
                <Tag value={domain} />
                <Tag value={level} />
                <Tag value={campus} />
                {tags.map((t) => (
                    <Tag key={t} value={t} severity="secondary" />
                ))}
            </div>

            <div className="att-class__foot">
                <div className="att-class__enrolled">
                    <i className="pi pi-users" />
                    {typeof totalCap === "number" ? `${enrolled}/${totalCap} students` : `${enrolled} enrolled`}
                </div>
                {typeof attendanceRate === "number" && <div className="att-class__rate">{attendanceRate}%</div>}
                <div className="att-class__cta">
                    <Button label="Take Attendance" onClick={goDetail} />
                </div>
            </div>
        </Card>
    );
}
