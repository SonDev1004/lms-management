export default function CourseFilterBar({ filter, counts, onChange }) {
    const options = ["All", "Ongoing", "Upcoming", "Completed"];
    return (
        <div className="filter-bar" role="toolbar" aria-label="Course status filter">
            {options.map((opt) => (
                <button
                    key={opt}
                    className={`filter-btn ${filter === opt ? "is-active" : ""}`}
                    onClick={() => onChange(opt)}
                    aria-pressed={filter === opt}
                    aria-label={`${opt} (${counts[opt] ?? 0})`}
                >
                    <span className="filter-label">{opt}</span>
                    <span className="filter-count">({counts[opt] ?? 0})</span>
                </button>
            ))}
        </div>
    );
}
