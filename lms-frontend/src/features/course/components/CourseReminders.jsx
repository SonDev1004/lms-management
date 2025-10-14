import { classifyReminder, reminderIcons } from "@/features/course/lib/reminders.js";

export default function CourseReminders({ reminders = [] }) {
    if (!reminders.length) return (
        <ul className="reminder-list"><li className="reminder-item reminder-normal">No reminders</li></ul>
    );
    return (
        <ul className="reminder-list" aria-live="polite">
            {reminders.map((r, idx) => {
                const kind = classifyReminder(r);
                const ic = reminderIcons[kind] || reminderIcons.normal;
                return (
                    <li className={`reminder-item reminder-${kind}`} key={idx} title={r}>
                        <span className="reminder-icon" role="img" aria-label={ic.label}>{ic.emoji}</span>
                        <span className="reminder-text">{r}</span>
                    </li>
                );
            })}
        </ul>
    );
}
