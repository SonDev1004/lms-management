import React, { useState } from "react";
import { faqs } from "../../mocks/about.mocks";
import "../../styles/faq.css";

export default function FAQ() {
    const [open, setOpen] = useState(-1);

    return (
        <section className="section faq">
            <h2 className="faq__title">Common Questions About Our Programs</h2>

            <div className="faq__wrap">
                {faqs.map((item, idx) => {
                    const expanded = open === idx;
                    return (
                        <div
                            key={item.q}
                            className={`faq-item ${expanded ? "is-open" : ""}`}
                        >
                            <button
                                className="faq-item__header"
                                onClick={() => setOpen(expanded ? -1 : idx)}
                                aria-expanded={expanded}
                                aria-controls={`faq-panel-${idx}`}
                            >
                                <span className="faq-item__q">{item.q}</span>
                                <span className="faq-item__chev" aria-hidden />
                            </button>

                            <div
                                id={`faq-panel-${idx}`}
                                className="faq-item__panel"
                                role="region"
                            >
                                <p className="faq-item__a">{item.a}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
