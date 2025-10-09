import React from 'react';
import ProgressItem from '../ProgressItem.jsx';
import ContactCard from '../ContactCard.jsx';

export default function OverviewPanel({ courses }) {
    return (
        <div className="sp-grid">
            <div className="sp-card">
                <div className="sp-card-title">
                    <span><i className="pi pi-book sp-ic" /> Course Progress</span>
                </div>
                <div className="sp-progress-list">
                    {courses.map((c) => (
                        <ProgressItem key={c.code} label={c.code} value={c.progress ?? 0} grade={c.letter} />
                    ))}
                </div>
            </div>
            <ContactCard />
        </div>
    );
}
