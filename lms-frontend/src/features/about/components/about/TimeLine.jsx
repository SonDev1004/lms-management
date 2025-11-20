import React from "react";
import { timeline } from "../../mocks/about.mocks";
import "../../styles/timeline.css";

export default function TimeLine() {
    return (
        <section className="section tl">
            <h2 className="tl__title">5 Years of Growing with Vietnamese Learners</h2>

            <div className="tl__wrap">
                <div className="tl__grid">
                    <div className="tl__rail" aria-hidden />
                    {timeline.map((t, idx) => (
                        <div key={t.year} className="tl__row">
                            <div className="tl__dot" aria-label={t.year}>
                                <span>{t.year}</span>
                            </div>
                            <div className="tl__card">
                                {t.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
