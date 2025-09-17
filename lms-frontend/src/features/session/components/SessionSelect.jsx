const SessionSelect = ({ sessions, sessionId, onChange }) => {
    if (sessions.length <= 1) return null;
    return (
        <select value={sessionId || ""} onChange={e => onChange(Number(e.target.value))} className="mb-3">
            <option value="">Chọn ca học</option>
            {sessions.map(s => (
                <option key={s.id} value={s.id}>{s.starttime} - {s.endtime}</option>
            ))}
        </select>);
}

export default SessionSelect;