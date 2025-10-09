import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";

export default function ProgramSidebar({ program = {} }) {
    const faqs = Array.isArray(program.faqs) && program.faqs.length
        ? program.faqs
        : [
            {
                q: "What is the refund policy?",
                a:
                    "We offer a full refund within the first 7 days of the course if you're not satisfied with the program quality.",
            },
            {
                q: "Can I switch between tracks?",
                a:
                    "Yes, you can switch between General and Academic tracks within the first 2 weeks of the program with no additional fees.",
            },
            {
                q: "What materials are included?",
                a:
                    "All course materials, practice tests, and digital resources are included in the program fee.",
            },
        ];

    return (
        <aside className="sidebar-sticky">
            {/* WHY THIS PROGRAM */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Why This Program?</h3>
                <div className="why-list">
                    <div className="why-item">
                        <div className="dot">
                            <i className="pi pi-bullseye" />
                        </div>
                        <div className="text">Streamlined band-targeted roadmap</div>
                    </div>
                    <div className="why-item">
                        <div className="dot">
                            <i className="pi pi-users" />
                        </div>
                        <div className="text">Small classes (6–12 students)</div>
                    </div>
                    <div className="why-item">
                        <div className="dot">
                            <i className="pi pi-sparkles" />
                        </div>
                        <div className="text">AI-assisted grading &amp; progress tracking</div>
                    </div>
                    <div className="why-item">
                        <div className="dot">
                            <i className="pi pi-shield" />
                        </div>
                        <div className="text">Clear learning guarantee</div>
                    </div>
                </div>
            </div>

            {/* QUICK CONTACT */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Quick Contact</h3>
                <div style={{ display: "grid", gap: 10 }}>
                    <Button icon="pi pi-phone" label="Hotline: 0123 456 789" text />
                    <div style={{ display: "flex", gap: 8 }}>
                        <Button icon="pi pi-comment" label="Zalo" outlined />
                        <Button icon="pi pi-whatsapp" label="WhatsApp" outlined />
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="card faq">
                <h3 style={{ marginTop: 0 }}>Frequently Asked Questions</h3>
                <Accordion>
                    {faqs.map((f, i) => (
                        <AccordionTab key={i} header={f.q}>
                            <p style={{ margin: 0, color: "var(--pg-muted)" }}>{f.a}</p>
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>

            {/* NOTES */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Important Notes</h3>
                <ul
                    style={{
                        margin: 0,
                        padding: "0 0 0 18px",
                        color: "var(--pg-muted)",
                        lineHeight: 1.7,
                    }}
                >
                    <li>Schedules may change based on enrollment</li>
                    <li>Minimum enrollment required to start classes</li>
                    <li>Materials fee not included in tuition</li>
                </ul>
            </div>

            {/* CTA */}
            <div className="footer-cta">
                <h4>Ready to Start?</h4>
                <p style={{ margin: "0 0 10px", opacity: 0.9 }}>
                    Get upcoming start dates and secure your spot today.
                </p>
                <Button label="Get Upcoming Start Dates" severity="secondary" />
            </div>
        </aside>
    );
}
