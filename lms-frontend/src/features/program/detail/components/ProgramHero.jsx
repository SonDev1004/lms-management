import { Button } from "primereact/button";

export default function ProgramHero({ program }) {
    return (
        <div className="program-hero">
            <div>
                <span className="badge-code">{program.code}</span>
                <h1 className="program-title">{program.title}</h1>

                <div className="badge-open">
                    <i className="pi pi-check-circle" />
                    Open for Enrollment
                </div>
                <div className="hero-actions">
                    <Button className="btn-dark" icon="pi pi-phone" label="Get Free Consultation" />
                    <Button className="btn-ghost" icon="pi pi-download" label="Download Roadmap" />
                </div>

            </div>

            <img className="hero-img"
                 src={program.image || "https://images.unsplash.com/photo-1523246191167-6f4546b14880?q=80&w=1600&auto=format&fit=crop"}
                 alt={program.title}/>
        </div>
    );
}
