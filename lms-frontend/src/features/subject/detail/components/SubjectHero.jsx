import React from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';

export default function SubjectHero({ subject, onEnrollClick }) {
    if (!subject) return null;

    const {
        title,
        audience = 'Teens & Adults',
        level = 'Intermediate (B1–B2)',
        summary = 'Boost your listening accuracy with exam-style drills.',
        rating = 4.7,
        reviewCount = 186,
        image = 'https://images.unsplash.com/photo-1523246191167-6f4546b14880?q=80&w=1600&auto=format&fit=crop',
    } = subject;

    return (
        <header className="sd-hero" aria-label="Subject hero">
            <img className="sd-hero__img" src={image} alt="" />
            <div className="sd-hero__main">
                <h1 className="sd-title">{title}</h1>

                <div className="sd-badges">
                    <Tag value={audience} className="sd-badge" />
                    <Tag value={level} className="sd-badge" />
                </div>

                <div className="sd-rating">
                    <Rating value={Number(rating)} readOnly cancel={false} />
                    <span className="font-bold">{Number(rating).toFixed(1)}</span>
                    <span className="text-600">• {reviewCount} reviews</span>
                </div>

                <p className="sd-summary">{summary}</p>

                <Button
                    label="Enroll now"
                    className="p-button-primary p-button-lg"
                    onClick={onEnrollClick}
                />
            </div>
        </header>
    );
}
