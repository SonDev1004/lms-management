
import { currency, classSize } from "../utils/format";

export default function ProgramFacts({ program }) {
    return (
        <div className="card">
            <div className="fact-grid">
                <Fact icon="pi pi-dollar" label="Tuition Fee"
                      value={<span className="value brand">{currency(program.fee)}</span>} />
                <Fact icon="pi pi-users" label="Class Size"
                      value={classSize(program.minStudents, program.maxStudents)} />
                {program.duration && <Fact icon="pi pi-clock" label="Duration" value={program.duration} />}
                {program.sessionsPerWeek && <Fact icon="pi pi-calendar" label="Sessions / Week" value={program.sessionsPerWeek} />}
                {program.target && <Fact icon="pi pi-bolt" label="Target" value={program.target} />}
                {program.tracks?.length ? (
                    <Fact icon="pi pi-sitemap" label="Tracks"
                          value={program.tracks.map(t => t.label).join(" · ")} />
                ) : null}
            </div>

            {/* Description + Read more */}
            {program.description && (
                <div style={{marginTop:18}}>
                    <h3 style={{margin:'12px 0 8px'}}>Program Description</h3>

                    <details className="readmore">
                        <summary>
                            <i className="pi pi-chevron-down chev" />
                            <span>Read more</span>
                        </summary>
                        <p>{program.description}</p>
                    </details>
                </div>
            )}
        </div>
    );
}

function Fact({ icon, label, value }) {
    return (
        <div className="fact">
            <div className="icon"><i className={`pi ${icon}`} /></div>
            <div>
                <div className="label">{label}</div>
                <div className="value">{value}</div>
            </div>
        </div>
    );
}