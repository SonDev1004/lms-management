import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export default function ProgramCard({ program }) {
    const nav = useNavigate();
    const p = program || {};

    const feeValue = p.fee ?? p.price ?? null;

    const header = (
        <img
            src={p.imageUrl || '/noimg.png'}
            alt={p.title || 'Program image'}
            className="program-card__img"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/noimg.png'; }}
        />
    );

    return (
        <Card className="program-card" header={header}>
            <div className="program-card__head">
                <h3 className="program-card__title">{p.title || 'Untitled program'}</h3>
                <Tag value={p.isActive ? 'Active' : 'Inactive'}
                     severity={p.isActive ? 'success' : 'danger'}
                     className="program-card__status" />
            </div>

            <p className="program-card__desc">
                {(p.description || '').trim() || 'No description available.'}
            </p>

            <div className="program-card__tuition">
                <div className="label">Tuition</div>
                <div className="price">{formatVND(feeValue)}</div>
            </div>

            <Button
                label="View Details"
                icon="pi pi-arrow-right"
                iconPos="right"
                text
                className="program-card__cta"
                onClick={() => nav(`/programs/${p.id}`)}
            />
        </Card>
    );
}


function formatVND(value) {
    if (value === null || value === undefined || value === '') return 'Contact us';
    const n = Number(value);
    if (!Number.isFinite(n)) return 'Contact us';
    return n.toLocaleString('vi-VN') + ' VND';
}
