import { useMemo, useState } from 'react';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const sev = (t) => t === 'positive' ? 'success' : t === 'improvement' ? 'warning' : 'info';

export default function FeedbackList({ items = [] }) {
    const [filter, setFilter] = useState('all');        // all | positive | improvement
    const [sort, setSort] = useState('new');            // new | old
    const [q, setQ] = useState('');

    const list = useMemo(() => {
        let data = items.slice();

        // search đơn giản theo note/author/course
        const qq = q.trim().toLowerCase();
        if (qq) {
            data = data.filter(x =>
                [x.note, x.author, x.class, x.tag, x.date].filter(Boolean)
                    .some(s => String(s).toLowerCase().includes(qq))
            );
        }

        if (filter !== 'all') data = data.filter(x => x.tag === filter);

        data.sort((a, b) => {
            const ta = new Date(a.date).getTime();
            const tb = new Date(b.date).getTime();
            return sort === 'new' ? tb - ta : ta - tb;
        });
        return data;
    }, [items, q, filter, sort]);

    const count = (t) => items.filter(x => t === 'all' ? true : x.tag === t).length;
    const initial = (name = '') => (name.trim()[0] || '?').toUpperCase();

    return (
        <div className="fb-wrap">
            {/* Toolbar */}
            <div className="tp-toolbar mb-3 fb-toolbar">
                <div className="tp-segmented" role="tablist" aria-label="Filter feedback">
                    <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>
                        All <span className="chip ml-2">{count('all')}</span>
                    </button>
                    <button className={filter==='positive'?'active':''} onClick={()=>setFilter('positive')}>
                        Positive <span className="chip ml-2">{count('positive')}</span>
                    </button>
                    <button className={filter==='improvement'?'active':''} onClick={()=>setFilter('improvement')}>
                        Improvement <span className="chip ml-2">{count('improvement')}</span>
                    </button>
                </div>

                <span className="grow" />

                <span className="p-input-icon-left mr-2">
          <i className="pi pi-search" />
          <InputText value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search feedback" className="w-15rem" />
        </span>

                <Dropdown value={sort} onChange={(e)=>setSort(e.value)}
                          options={[
                              { label: 'Newest first', value: 'new' },
                              { label: 'Oldest first', value: 'old' }
                          ]}
                          className="w-12rem" />
            </div>

            {/* List */}
            <div className="fb-list">
                {list.length === 0 && (
                    <div className="fb-empty">
                        <i className="pi pi-inbox mr-2" />
                        No feedback found.
                    </div>
                )}

                {list.map(f => (
                    <article key={f.id} className="fb-card">
                        <header className="fb-head">
                            <div className="fb-left">
                                <div className="fb-avatar">{initial(f.author)}</div>
                                <div className="fb-title">
                                    <div className="fb-line">
                                        <strong className="fb-author">{f.author}</strong>
                                        <span className="fb-class">{f.class}</span>
                                    </div>
                                    <Tag value={f.tag} severity={sev(f.tag)} rounded className="fb-tag" />
                                </div>
                            </div>
                            <time className="fb-date">{f.date}</time>
                        </header>

                        <p className="fb-note">{f.note}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
