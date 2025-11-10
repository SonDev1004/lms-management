import React from "react";
import { teachers } from "../../mocks/about.mocks";
import "../../styles/teachergrid.css";

export default function TeachersGrid() {
    return (
        <section className="section section--teachers">
            <div className="head">
                <h2>Meet Your Expert Teachers</h2>
            </div>

            <div className="teachers-grid">
                {teachers.map((t) => (
                    <article key={t.name} className="teacher-card">
                        <div className="teacher-avatar" aria-hidden>
                            <i className="pi pi-users" />
                        </div>

                        <h3 className="teacher-name">{t.name}</h3>

                        <div className="badges">
                            {t.badges.map((b, i) => (
                                <span key={i} className="badge-pill">{b}</span>
                            ))}
                        </div>

                        <p className="teacher-bio">{t.bio}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
