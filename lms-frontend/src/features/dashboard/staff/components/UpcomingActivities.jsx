import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import '../styles/UpcomingActivities.css';

const DEFAULT_ITEM_MAPPER = x => x;

export default function UpcomingActivities({ items = [], itemMapper = DEFAULT_ITEM_MAPPER }){
    const normItems = useMemo(() => {
        return (items || []).map(raw => {
            const it = itemMapper(raw) || {};
            const parse = v => (v instanceof Date ? v : (v ? new Date(v) : null));
            const start = parse(it.start || it.datetime || it.date);
            const end = parse(it.end || null);
            let duration = it.duration;
            if (!duration && start && end) {
                const mins = Math.round((end - start) / 60000);
                duration = `${mins} mins`;
            }
            return {
                id: it.id ?? it._id ?? Math.random().toString(36).slice(2,9),
                title: it.title ?? it.name ?? 'Untitled',
                start,
                end,
                location: it.location ?? it.meta ?? it.room ?? '',
                duration: duration ?? '',
                type: it.type ?? it.kind ?? 'other',
                note: it.note ?? it.metaNote ?? '',
                url: it.url ?? it.link ?? null,
                attendees: it.attendees ?? it.count ?? null
            };
        }).filter(Boolean);
    }, [items, itemMapper]);

    const grouped = useMemo(() => {
        const groups = {};
        const dateKey = d => d ? d.toISOString().slice(0,10) : 'no-date';
        for (const it of normItems) {
            const key = dateKey(it.start);
            if (!groups[key]) groups[key] = [];
            groups[key].push(it);
        }
        const ordered = Object.keys(groups).sort().map(key => ({ key, items: groups[key].sort((a,b) => {
                if (!a.start) return 1; if (!b.start) return -1;
                return a.start - b.start;
            })}));
        return ordered;
    }, [normItems]);

    const formatTime = d => d ? new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit'}).format(d) : '--:--';
    const formatHeader = d => {
        if (!d) return 'No date';
        const today = new Date();
        const tKey = today.toISOString().slice(0,10);
        const dKey = d.toISOString().slice(0,10);
        if (tKey === dKey) return 'Today';
        const tomorrow = new Date(); tomorrow.setDate(today.getDate()+1);
        if (tomorrow.toISOString().slice(0,10) === dKey) return 'Tomorrow';
        return new Intl.DateTimeFormat(undefined,{weekday:'short', month:'short', day:'numeric'}).format(d);
    };

    const iconForType = type => {
        switch((type||'').toLowerCase()){
            case 'test': return '📝';
            case 'meeting': return '👥';
            case 'call': return '📞';
            case 'demo': return '🎤';
            case 'one-on-one': return '🤝';
            default: return '📌';
        }
    };

    const typeColor = type => {
        switch((type||'').toLowerCase()){
            case 'test': return 'var(--color-test)';
            case 'meeting': return 'var(--color-meeting)';
            case 'call': return 'var(--color-call)';
            case 'demo': return 'var(--color-demo)';
            case 'one-on-one': return 'var(--color-1on1)';
            default: return 'var(--color-default)';
        }
    };

    const goto = (it) => {
        if (it.url) {
            window.open(it.url, '_blank');
            return;
        }
        window.location.href = 'http://localhost:5173/staff/schedule-overview';
    };

    return (
        <Card className="ua-card">
            <div className="ua-header">
                <h3>Upcoming Activities</h3>
                <button className="ua-viewall" onClick={() => window.location.href = '/staff/schedule-overview'}>View all</button>
            </div>

            {normItems.length === 0 ? (
                <div className="ua-empty">No upcoming activities</div>
            ) : (
                <div className="ua-body">
                    {grouped.map(g => {
                        const sample = g.items[0];
                        const groupDate = sample && sample.start ? new Date(sample.start) : null;
                        return (
                            <div className="ua-group" key={g.key}>
                                <div className="ua-group-header">{formatHeader(groupDate)}</div>
                                <ul className="ua-list">
                                    {g.items.map(it => (
                                        <li key={it.id} className="ua-item" onClick={() => goto(it)} title={it.title}>
                                            <div className="ua-time">
                                                <div className="ua-time-main">{it.start ? formatTime(it.start) : '—'}</div>
                                                <div className="ua-time-sub">{it.duration}</div>
                                            </div>

                                            <div className="ua-content">
                                                <div className="ua-title-row">
                                                    <span className="ua-dot" style={{background: typeColor(it.type)}} aria-hidden></span>
                                                    <span className="ua-title">{it.title}</span>
                                                    {it.attendees ? <span className="ua-att">• {it.attendees}</span> : null}
                                                </div>
                                                <div className="ua-meta">{it.location}{it.note ? ` • ${it.note}` : ''}</div>
                                            </div>

                                            <div className="ua-icon">{iconForType(it.type)}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}

UpcomingActivities.propTypes = {
    items: PropTypes.array,
    itemMapper: PropTypes.func
};