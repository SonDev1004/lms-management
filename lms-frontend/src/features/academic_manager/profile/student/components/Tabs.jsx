import React from 'react';
import { cap } from '../../student/utils/studentProfile.utils';

const tabs = ['overview', 'courses', 'attendance', 'grades', 'feedback'];

export default function Tabs({ active, onChange }) {
    return (
        <div className="sp-tabs">
            {tabs.map((t) => (
                <button
                    key={t}
                    className={`sp-tab ${active === t ? 'sp-tab-active' : ''}`}
                    onClick={() => onChange(t)}
                >
                    {cap(t)}
                </button>
            ))}
        </div>
    );
}
