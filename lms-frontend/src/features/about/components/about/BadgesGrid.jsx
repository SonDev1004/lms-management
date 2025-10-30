import React from "react";
import { badges } from "../../mocks/about.mocks";
import "../../styles/badges.css";

export default function BadgesGrid() {
    return (
        <section className="section about-orgs">
            <h2 className="about-orgs__title">Recognized by Leading Organizations</h2>

            <div className="about-orgs__grid">
                {badges.map((b) => (
                    <a
                        key={b.title}
                        className="about-orgs__card"
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="about-orgs__iconbar">
                            <div className="about-orgs__icon">
                                <i className="pi pi-bookmark" aria-hidden />
                            </div>
                        </div>

                        <div className="about-orgs__content">
                            <h3 className="about-orgs__name">{b.title}</h3>
                            <p className="about-orgs__sub">{b.subtitle}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
