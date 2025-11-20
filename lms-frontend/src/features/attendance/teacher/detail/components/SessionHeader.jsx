import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function SessionHeader() {
    const navigate = useNavigate();
    const { state } = useLocation();

    return (
        <div className="attd-head">
            <div className="attd-head__left">
                <Button
                    icon="pi pi-arrow-left"
                    label="Back"
                    className="attd-back"
                    outlined
                    size="small"
                    onClick={() => navigate(state?.fromAttendance || "/teacher/attendance", { replace: true })}
                />
                <div>
                    <h1 className="attd-title">Advanced Mathematics</h1>
                    <div className="attd-sub">MATH301 • Dr. Sarah Johnson</div>
                </div>
            </div>
            <div className="attd-session-badge">Session Ended</div>
        </div>
    );
}
