import React from 'react';

export default function PageHeader({
                                       title = "New Enrollments",
                                       sub = "Manage and review new course and subject enrollment requests",
                                   }) {
    return (
        <div className="ne-page-header">
            <h1 className="ne-ph-title">
                {title}
                <span className="ne-ph-accent" />
            </h1>
            <p className="ne-ph-sub">{sub}</p>
        </div>
    );
}
