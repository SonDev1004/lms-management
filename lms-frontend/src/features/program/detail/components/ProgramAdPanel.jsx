import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useState, useEffect } from "react";
import "../styles/program-ad-panel.css";

export default function ProgramAdPanel({ title = "Sponsored", items = [], side = "left" }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Lazy load ads panel
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`program-ad-panel program-ad-panel--${side}`}>
            <div className="program-ad-panel__top">
                <div className="program-ad-panel__title">{title}</div>
                <Tag value="Promo" severity="info" rounded />
            </div>

            <div className="program-ad-panel__stack">
                {items.slice(0, 2).map((it, idx) => (
                    <Card
                        key={idx}
                        className="program-ad-panel__card"
                        role="complementary"
                        aria-label={`Promotion ${idx + 1}: ${it.title}`}
                    >
                        {it.img && (
                            <div className="program-ad-panel__imgwrap">
                                <img
                                    className="program-ad-panel__img"
                                    src={it.img}
                                    alt={it.title}
                                    loading="lazy"
                                    width="260"
                                    height="120"
                                />
                            </div>
                        )}

                        <div className="program-ad-panel__content">
                            <h3 className="program-ad-panel__cardTitle">{it.title}</h3>
                            <p className="program-ad-panel__cardSub">{it.subtitle}</p>

                            <div className="program-ad-panel__actions">
                                <Button
                                    label={it.cta || "Learn more"}
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    size="small"
                                    className="program-ad-panel__btn"
                                    onClick={it.onClick}
                                    aria-label={`${it.cta || "Learn more"} about ${it.title}`}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <small className="program-ad-panel__note">
                Promotional content
            </small>
        </div>
    );
}