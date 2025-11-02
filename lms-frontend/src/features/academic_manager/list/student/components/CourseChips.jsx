import React from 'react';
import { Badge } from 'primereact/badge';

import '../styles/student-management.css';
export default function CourseChips({ list=[] }) {
    return (
        <div className="flex align-items-center flex-wrap gap-2">
            {list.slice(0,2).map(code => (
                <span key={code} className="p-badge p-component">{code}</span>
            ))}
            {list.length > 2 && <Badge value={`+${list.length-2}`} />}
        </div>
    );
}
