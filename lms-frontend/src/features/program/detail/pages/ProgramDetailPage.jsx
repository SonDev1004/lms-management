import { useParams } from "react-router-dom";
import { useMemo } from "react";
import useProgramDetail from "../hooks/useProgramDetail";
import ProgramHero from "../components/ProgramHero";
import ProgramFacts from "../components/ProgramFacts";
import ProgramSubjects from "../components/ProgramSubjects";
import ProgramSidebar from "../components/ProgramSidebar";
import ProgramAdPanel from "../components/ProgramAdPanel";
import "../styles/program-detail.css";
import "../styles/program-detail-ads.css";

export default function ProgramDetailPage() {
    const { id } = useParams();
    const { data: program, loading, error } = useProgramDetail(id);

    const tracksUI = useMemo(
        () =>
            (program?.tracks || []).map((t) => ({
                code: (t.trackCode || "").trim(),
                label: t.trackLabel || t.trackCode,
            })),
        [program?.tracks]
    );

    // Memoize ad items
    const leftAdItems = useMemo(
        () => [
            {
                title: "Early-bird discount",
                subtitle: "Register this week to save up to 15%",
                cta: "See details",
                onClick: () => console.log("Left ad 1 clicked"),
            },
            {
                title: "Free placement test",
                subtitle: "Get recommended track instantly",
                cta: "Take test",
                onClick: () => console.log("Left ad 2 clicked"),
            },
        ],
        []
    );

    const rightAdItems = useMemo(
        () => [
            {
                title: "1:1 Mentor Support",
                subtitle: "Weekly coaching with top instructors",
                cta: "Book a slot",
                onClick: () => console.log("Right ad 1 clicked"),
            },
            {
                title: "Bundle offer",
                subtitle: "Join 2 programs and get bonus sessions",
                cta: "View bundles",
                onClick: () => console.log("Right ad 2 clicked"),
            },
        ],
        []
    );

    if (loading) {
        return (
            <div className="program-detail">
                <div className="program-detail-loading" role="status" aria-live="polite">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem", color: "#3b82f6" }} aria-hidden="true"></i>
                    <p style={{ marginTop: "1rem", fontSize: "1.125rem" }}>Loading program details...</p>
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="program-detail">
                <div className="program-detail-error" role="alert">
                    <i
                        className="pi pi-exclamation-triangle"
                        style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "1rem" }}
                        aria-hidden="true"
                    ></i>
                    <h3 style={{ marginBottom: "0.5rem" }}>Cannot load this program</h3>
                    <p style={{ color: "#64748b" }}>
                        {error || "The program you're looking for doesn't exist or has been removed."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="program-detail">
            <div className="container">
                <div className="program-detail-shell">
                    {/* Left Ads */}
                    <aside
                        className="program-detail-ads program-detail-ads--left"
                        aria-label="Promotional content"
                    >
                        <ProgramAdPanel
                            side="left"
                            title="Scholarships"
                            items={leftAdItems}
                        />
                    </aside>

                    {/* Main content */}
                    <main className="program-detail-main">
                        <ProgramHero program={program} />

                        <div className="program-grid">
                            <div className="program-main-content">
                                <ProgramFacts
                                    tracks={tracksUI}
                                    subjects={program?.subjectList || []}
                                    program={program}
                                />
                                <ProgramSubjects program={program} />
                            </div>

                            <div className="program-sidebar-wrapper">
                                <ProgramSidebar program={program} />
                            </div>
                        </div>
                    </main>

                    {/* Right Ads */}
                    <aside
                        className="program-detail-ads program-detail-ads--right"
                        aria-label="Featured promotions"
                    >
                        <ProgramAdPanel
                            side="right"
                            title="Hot picks"
                            items={rightAdItems}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
}