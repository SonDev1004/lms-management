import React from "react";
import '../../styles/methodgrid.css';
const items = [
    {
        icon: "pi pi-bullseye",
        color: "blue",
        title: "Personalized Path",
        desc: "AI assessment creates your custom roadmap based on strengths, weaknesses, and goals."
    },
    {
        icon: "pi pi-comment",
        color: "green",
        title: "Per-session Feedback",
        desc: "Native speakers and certified teachers provide detailed feedback after every lesson."
    },
    {
        icon: "pi pi-book",
        color: "purple",
        title: "Exercise Bank",
        desc: "Access 10,000+ practice questions updated monthly with latest test formats."
    },
    {
        icon: "pi pi-chart-bar",
        color: "orange",
        title: "Progress Reports",
        desc: "Weekly analytics show exactly where you're improving and what needs focus."
    }
];

export default function MethodGrid() {
    return (
        <section className="section section--method">
            <div className="method-head">
                <h2 className="title">How We Help You Master English</h2>
                <p className="sub">
                    Our 4-step method combines technology with human expertise for maximum learning efficiency.
                </p>
            </div>

            <div className="grid">
                {items.map((it) => (
                    <div key={it.title} className="card">
                        <div className={`ico ${it.color}`} aria-hidden>
                            <i className={it.icon} />
                        </div>
                        <h3>{it.title}</h3>
                        <p>{it.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
