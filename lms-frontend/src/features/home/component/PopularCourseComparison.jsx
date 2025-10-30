import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import '../styles/home.css';

export default function PopularCourseComparison({ items = [], onViewAll }) {
    return (
        <section className="compare-section">
            <div className="compare-section__inner">
                <h2 className="compare-title">Popular Course Comparison</h2>
                <p className="compare-subtitle">Choose the course that best fits your goals</p>

                <div className="compare-grid">
                    {items.map((item) => (
                        <Card key={item.id} className="compare-card card-shadow">
                            <div className="compare-card__title">{item.title}</div>

                            <div className="compare-card__rating">
                                <i className="pi pi-star-fill" />
                                <span>{item.rating}</span>
                            </div>

                            <div className="compare-card__target">
                                <span className="compare-card__target-label">Target:</span>{' '}
                                <span className="compare-card__target-value">{item.target}</span>
                            </div>

                            <div className="compare-card__months">{item.months} months</div>
                        </Card>
                    ))}
                </div>

                <div className="compare-cta">
                    <Button
                        className="p-button-rounded p-button-outlined compare-cta__btn"
                        label="View all programs"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        onClick={onViewAll}
                    />
                </div>
            </div>
        </section>
    );
}
