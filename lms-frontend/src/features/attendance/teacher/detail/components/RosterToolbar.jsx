import { Button } from "primereact/button";
import '../styles/roster.css';
export default function RosterToolbar({ counters, total, onMarkAllPresent, onInvert }) {
    return (
        <div className="attd-toolbar">
            <div className="attd-toolbar__left">
                <Button icon="pi pi-check-circle" label="Mark All Present" outlined severity="success" onClick={onMarkAllPresent} />
                <Button icon="pi pi-refresh" label="Invert Selection" outlined className="ml-2" onClick={onInvert} />
            </div>
            <div className="attd-toolbar__right">
                <i className="pi pi-users mr-2" />
                <span>{total} students</span>
                <span className="attd-count attd-count--p">P: {counters.P}</span>
                <span className="attd-count attd-count--l">L: {counters.L}</span>
                <span className="attd-count attd-count--a">A: {counters.A}</span>
                <span className="attd-count attd-count--e">E: {counters.E}</span>
            </div>
        </div>
    );
}
