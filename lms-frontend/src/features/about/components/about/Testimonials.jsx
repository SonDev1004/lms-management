import React from "react";
import { testimonials } from "../../mocks/about.mocks";
import "../../styles/testimonials.css";

function variantFromTint(tint = "") {
    if (tint.includes("green")) return "green";
    if (tint.includes("blue")) return "blue";
    return "neutral";
}

export default function Testimonials() {
    return (
        <section className="section t">
            <h2 className="t__title">Real Success from Real Students</h2>

            <div className="t__grid">
                {testimonials.map((item) => {
                    const v = variantFromTint(item.tint);
                    return (
                        <article key={item.name} className={`t-card t-card--${v}`}>
                            {/* header */}
                            <div className="t-card__head">
                                <div className={`t-avatar t-avatar--${v}`} aria-hidden>
                                    <i className="pi pi-user" />
                                </div>
                                <div className="t-head__text">
                                    <div className="t-name">
                                        {item.name}, {item.age}
                                    </div>
                                    <div className="t-role">{item.role}</div>
                                </div>
                            </div>

                            {/* tags */}
                            <div className="t-badges">
                                <span className="t-pill t-pill--ghost">{item.goal}</span>
                                <span className={`t-pill t-pill--result t-pill--${v}`}>
                  {item.result}
                </span>
                            </div>

                            {/* quote */}
                            <p className="t-quote">“{item.quote}”</p>

                            {/* stars */}
                            <div className="t-stars" aria-label="5 stars">
                                <i className="pi pi-star-fill" />
                                <i className="pi pi-star-fill" />
                                <i className="pi pi-star-fill" />
                                <i className="pi pi-star-fill" />
                                <i className="pi pi-star-fill" />
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
