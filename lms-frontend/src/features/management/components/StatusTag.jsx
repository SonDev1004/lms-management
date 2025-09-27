import React from 'react';
import { Tag } from 'primereact/tag';

export default function StatusTag({ value }) {
    const severity =
        value === 'active' ? 'success' :
            value === 'graduated' ? 'info' : 'danger';
    return <Tag value={value?.[0]?.toUpperCase() + value?.slice(1)} severity={severity} className="rounded" />;
}
