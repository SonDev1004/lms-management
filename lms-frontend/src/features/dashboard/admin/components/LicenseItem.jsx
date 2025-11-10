import { percent, toneToClass } from "../utils/format";

export default function LicenseItem({ name, seats, daysLeft, status, tone }) {
    const p = percent(seats.used, seats.total);
    return (
        <div className="license">
            <div className="row">
                <div className="name">{name}</div>
                <div className={toneToClass(tone)}>{status}</div>
            </div>
            <div className="row" style={{marginTop:6}}>
                <div className="meta">Seats: {seats.used}/{seats.total}</div>
                <div className="meta" style={{marginLeft:"auto"}}>{daysLeft} days left</div>
            </div>
            <div className="progress" style={{marginTop:8}}>
                <span style={{width: `${p}%`}} />
            </div>
        </div>
    );
}
