import React, { useEffect, useState, useMemo } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import '../styles/RecentActivity.css';

function IconForType({ type }) {
    const base = 'pi';
    const cls = {
        alert: 'pi-exclamation-triangle',
        feedback: 'pi-comments',
        completed: 'pi-check-circle',
        enroll: 'pi-user-plus',
    }[type] || 'pi-info-circle';

    return <i className={`${base} ${cls} ra-icon`} aria-hidden />;
}

export default function RecentActivity({
                                           items: propItems = null,
                                           apiUrl = null,
                                           limit = 6,
                                           onItemClick = null
                                       }) {
    const [items, setItems] = useState(propItems || []);
    const [loading, setLoading] = useState(Boolean(apiUrl && !propItems));
    const [error, setError] = useState(null);
    const [activeKey, setActiveKey] = useState('all');

    const normalizeItems = (raw) => {
        if (!raw) return [];
        if (Array.isArray(raw)) {
            return raw.map((it, idx) => ({
                id: it.id ?? idx,
                type: (it.type ?? it.category ?? 'enroll').toString(),
                title: it.title ?? it.name ?? it.action ?? 'Activity',
                desc: it.desc ?? it.description ?? it.detail ?? '',
                time: it.time ?? it.timestamp ?? it.createdAt ?? '',
            }));
        }
        return normalizeItems(raw.data || raw.items || raw.result);
    };

    useEffect(() => {
        let cancelled = false;
        if (!apiUrl) return;

        setLoading(true);
        setError(null);

        fetch(apiUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                if (cancelled) return;
                setItems(normalizeItems(json));
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message || 'Fetch error');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [apiUrl]);

    const types = useMemo(() => {
        const set = new Set(items.map(i => i.type));
        return ['all', ...Array.from(set)];
    }, [items]);

    const filtered = useMemo(() => {
        const base = (items || []).filter(Boolean);
        const list = activeKey === 'all' ? base : base.filter(it => it.type === activeKey);
        return list.slice(0, limit);
    }, [items, activeKey, limit]);

    const renderItem = (it) => (
        <div
            key={it.id}
            className={`activity-item ${it.type || ''} ${onItemClick ? 'clickable' : ''}`}
            role={onItemClick ? 'button' : undefined}
            tabIndex={onItemClick ? 0 : undefined}
            onClick={() => onItemClick && onItemClick(it)}
            onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && onItemClick) onItemClick(it); }}
        >
            <div className="ra-left p-d-flex p-ai-center">
                <div className="ra-icon-wrap p-d-flex p-ai-center p-jc-center">
                    <IconForType type={it.type} />
                </div>
            </div>

            <div className="ra-middle">
                <div className="activity-title">{it.title}</div>
                <div className="activity-desc">{it.desc}</div>
            </div>

            <div className="ra-right p-d-flex p-flex-column p-jc-center">
                <div className="activity-time">
                    <i className="pi pi-clock time-pi" aria-hidden />
                    <span className="time-text">{it.time}</span>
                </div>
            </div>
        </div>
    );

    return (
        <Card className="recent-activity p-shadow-3">
            <div className="ra-header p-d-flex p-jc-between p-ai-center">
                <h3 className="ra-title">Recent Activity</h3>
            </div>

            <TabView activeIndex={types.indexOf(activeKey)} onTabChange={(e) => setActiveKey(types[e.index])}>
                {types.map((t) => (
                    <TabPanel header={t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)} key={t}>
                        {loading ? (
                            <div className="ra-empty">Loading activity...</div>
                        ) : error ? (
                            <div className="ra-empty ra-error">Error: {error}</div>
                        ) : filtered.length === 0 ? (
                            <div className="ra-empty">No recent activity</div>
                        ) : (
                            <div className="activity-list">
                                {filtered.map(renderItem)}
                            </div>
                        )}
                    </TabPanel>
                ))}
            </TabView>
        </Card>
    );
}
