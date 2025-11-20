import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

const STATUS = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
];

const PAY_STATUS = [
    { label: 'Paid', value: 'Paid' },
    { label: 'Unpaid', value: 'Unpaid' },
    { label: 'Refunded', value: 'Refunded' },
    { label: 'Partial', value: 'Partial' },
];

const startOfMonth = (d = new Date()) =>
    new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);

const endOfMonth = (d = new Date()) =>
    new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

const addDays = (d, n) =>
    new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() + n,
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
        d.getMilliseconds()
    );

export default function FiltersPanel({
                                         state,
                                         setState,
                                         onReset,
                                         onExport,
                                         onChange,
                                         showSearch = false,
                                         programOptions = [],
                                         courseOptions = [],
                                         loadCoursesByProgram,
                                         layout = 'inline',
                                         loadingCourses = false,
                                     }) {
    const s = React.useCallback(
        (k, v) => {
            setState(prev => {
                const next = { ...prev, [k]: v };
                onChange?.(next);
                return next;
            });
        },
        [setState, onChange]
    );

    const rootCls = `ne-card ne-filters ${layout === 'inline' ? 'ne-inline' : ''}`;

    const [courses, setCourses] = React.useState(courseOptions || []);
    const [coursesBusy, setCoursesBusy] = React.useState(false);

    React.useEffect(() => {
        setCourses(courseOptions);
    }, [courseOptions]);

    React.useEffect(() => {
        let alive = true;
        (async () => {
            if (state.course) s('course', null);

            if (typeof loadCoursesByProgram === 'function') {
                try {
                    setCoursesBusy(true);
                    const res = await loadCoursesByProgram(state.program);
                    if (!alive) return;
                    setCourses(Array.isArray(res) ? res : []);
                } catch (err) {
                    if (alive) {
                        console.error('[FiltersPanel] loadCoursesByProgram failed:', err);
                        setCourses([]);
                    }
                } finally {
                    if (alive) setCoursesBusy(false);
                }
            } else {
                if (state.program && Array.isArray(courseOptions) && courseOptions.length) {
                    setCourses(
                        courseOptions.filter(c => String(c.programId ?? '') === String(state.program))
                    );
                } else {
                    setCourses(courseOptions);
                }
            }
        })();

        return () => {
            alive = false;
        };
    }, [state.program, courseOptions, loadCoursesByProgram, s, state.course]);

    const searchDebRef = React.useRef(null);

    const onSearchChange = val => {
        clearTimeout(searchDebRef.current);
        searchDebRef.current = setTimeout(() => s('query', val), 300);
    };

    React.useEffect(() => {
        return () => clearTimeout(searchDebRef.current);
    }, []);

    const applyPreset = key => {
        const today = new Date();
        if (key === '7d') {
            s('from', addDays(today, -6));
            s('to', today);
            return;
        }
        if (key === '30d') {
            s('from', addDays(today, -29));
            s('to', today);
            return;
        }
        if (key === 'month') {
            s('from', startOfMonth(today));
            s('to', endOfMonth(today));
            return;
        }
        if (key === 'clear') {
            s('from', null);
            s('to', null);
            return;
        }
    };

    return (
        <div className={rootCls} role="region" aria-label="Filters">
            {showSearch && (
                <>
                    <div className="ne-section-title">Search Students</div>
                    <div className="ne-field ne-input">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText
                  placeholder="Name, email, phone, or student ID"
                  defaultValue={state.query || ''}
                  onChange={e => onSearchChange(e.target.value)}
                  className="w-full"
                  inputId="ne-search"
                  aria-label="Search students"
              />
            </span>
                    </div>
                </>
            )}

            <div className="ne-field ne-field-status">
                <label htmlFor="ne-status" className="ne-field-label">Status</label>
                <Dropdown
                    id="ne-status"
                    className="ne-select w-full"
                    value={state.status ?? null}
                    options={STATUS}
                    onChange={e => s('status', e.value)}
                    placeholder="Select status"
                    showClear
                    aria-label="Filter by enrollment status"
                />
            </div>

            <div className="ne-field ne-field-pay">
                <label htmlFor="ne-pay" className="ne-field-label">Payment Status</label>
                <Dropdown
                    id="ne-pay"
                    className="ne-select w-full"
                    value={state.payStatus ?? null}
                    options={PAY_STATUS}
                    onChange={e => s('payStatus', e.value)}
                    placeholder="Select payment status"
                    showClear
                    aria-label="Filter by payment status"
                />
            </div>

            <div className="ne-field ne-qa">
                <Button
                    label="Reset"
                    icon="pi pi-refresh"
                    className="ne-btn-reset"
                    onClick={onReset}
                    aria-label="Reset all filters"
                />
                <Button
                    label="Export"
                    icon="pi pi-download"
                    className="ne-btn-export"
                    onClick={onExport}
                    aria-label="Export filtered enrollments to CSV"
                />
            </div>

            <div className="ne-field ne-field-from">
                <label htmlFor="ne-from" className="ne-field-label">From Date</label>
                <Calendar
                    id="ne-from"
                    value={state.from || null}
                    onChange={e => s('from', e.value)}
                    showIcon
                    showButtonBar
                    touchUI
                    dateFormat="dd/mm/yy"
                    placeholder="Select start date"
                    className="ne-calendar w-full"
                    aria-label="Filter from date"
                />
                <div className="ne-presets">
                    <button type="button" onClick={() => applyPreset('7d')}>Last 7d</button>
                    <button type="button" onClick={() => applyPreset('30d')}>Last 30d</button>
                    <button type="button" onClick={() => applyPreset('month')}>This month</button>
                    <button type="button" className="muted" onClick={() => applyPreset('clear')}>Clear</button>
                </div>
            </div>

            <div className="ne-field ne-field-to">
                <label htmlFor="ne-to" className="ne-field-label">To Date</label>
                <Calendar
                    id="ne-to"
                    value={state.to || null}
                    onChange={e => s('to', e.value)}
                    showIcon
                    showButtonBar
                    touchUI
                    dateFormat="dd/mm/yy"
                    placeholder="Select end date"
                    className="ne-calendar w-full"
                    aria-label="Filter to date"
                />
            </div>

            <div className="ne-field ne-field-program">
                <label htmlFor="ne-program" className="ne-field-label">Program</label>
                <Dropdown
                    id="ne-program"
                    className="ne-select w-full"
                    value={state.program ?? null}
                    options={programOptions}
                    onChange={e => s('program', e.value)}
                    placeholder="All programs"
                    filter
                    showClear
                    aria-label="Filter by program"
                />
            </div>

            <div className="ne-field ne-field-course">
                <label htmlFor="ne-course" className="ne-field-label">Course</label>
                <Dropdown
                    id="ne-course"
                    className="ne-select w-full"
                    value={state.course ?? null}
                    options={courses}
                    onChange={e => s('course', e.value)}
                    placeholder="All courses"
                    filter
                    showClear
                    loading={loadingCourses || coursesBusy}
                    aria-label="Filter by course"
                    aria-busy={loadingCourses || coursesBusy}
                />
            </div>
        </div>
    );
}
