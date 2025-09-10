import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const _events = [{
    id: 1,
    title: 'IELTS Class - Beginner',
    start: '2025-09-08T08:30:00',
    end: '2025-09-08T10:00:00',
    teacher: 'Ms. Lan',
    room: 'A101',
    type: 'Lecture',
}, {
    id: 2,
    title: 'TOEIC Practice - Listening',
    start: '2025-09-09T10:00:00',
    end: '2025-09-09T11:30:00',
    teacher: 'Mr. Huy',
    room: 'B203',
    type: 'Practice',
}, {
    id: 3,
    title: '1:1 Speaking Session',
    start: '2025-09-10T14:00:00',
    end: '2025-09-10T14:45:00',
    teacher: 'Ms. Mai',
    room: 'C301',
    type: 'One-on-one',
},];

let mockAdapter = null;
let generatedMonths = new Set();

function getNextId() {
    return _events.reduce((max, e) => Math.max(max, e.id || 0), 0) + 1;
}

function generateSpeakingAdvancedForMonth(year = 2025, monthZeroIndex = 8) {
    const speakingTeacher = 'Ms. Linh';
    const room = 'S201';
    const sessionsTemplate = [['17:30', '19:00', 'Nhóm A'], ['19:10', '20:25', 'Nhóm B'], ['20:35', '21:30', 'Nhóm C'],];

    const items = [];
    const startDate = new Date(year, monthZeroIndex, 1);
    const endDate = new Date(year, monthZeroIndex + 1, 0);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dow = d.getDay();
        if ([2, 4, 6].includes(dow)) {
            const y = d.getFullYear();
            const m = d.getMonth();
            const day = d.getDate();
            const s = sessionsTemplate[0];
            const [st, en, group] = s;
            const startIso = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${st}:00`;
            const endIso = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${en}:00`;
            items.push({
                title: `Speaking Nâng Cao - ${group}`,
                start: startIso,
                end: endIso,
                teacher: speakingTeacher,
                room,
                type: 'Speaking Nâng Cao',
            });
        }
    }
    return items;
}

export function initMock(options = {year: 2025, monthZeroIndex: 8, delay: 200}) {
    if (mockAdapter) return mockAdapter;

    const {year, monthZeroIndex, delay} = options;
    const monthKey = `${year}-${String(monthZeroIndex).padStart(2, '0')}`;
    if (!generatedMonths.has(monthKey)) {
        const generated = generateSpeakingAdvancedForMonth(year, monthZeroIndex);
        generated.forEach((g) => {
            const exists = _events.some((e) => e.title === g.title && e.start === g.start);
            if (!exists) {
                g.id = getNextId();
                _events.push(g);
            }
        });
        generatedMonths.add(monthKey);
    }

    mockAdapter = new MockAdapter(axios, {delayResponse: delay});

    function parseQuery(config) {
        const result = {};
        try {
            const url = config.url || '';
            const qIndex = url.indexOf('?');
            const raw = qIndex >= 0 ? url.substring(qIndex + 1) : '';
            const params = new URLSearchParams(raw);
            for (const [k, v] of params.entries()) {
                result[k] = v;
            }
        } catch (e) {
            console.warn(e);
        }
        if (config && config.params) {
            Object.assign(result, config.params);
        }
        return result;
    }

    mockAdapter.onGet('/api/events').reply((config) => {
        try {
            const q = parseQuery(config);
            let out = _events.slice();
            if (q.teacher) {
                out = out.filter((e) => String(e.teacher).toLowerCase() === String(q.teacher).toLowerCase());
            }
            if (q.type) {
                out = out.filter((e) => String(e.type).toLowerCase() === String(q.type).toLowerCase());
            }
            const payload = JSON.parse(JSON.stringify(out));
            return [200, {events: payload}];
        } catch (e) {
            console.warn(e);
            return [500, {message: 'Mock server error'}];
        }
    });

    mockAdapter.onPost('/api/events').reply((config) => {
        try {
            const payload = config && config.data ? JSON.parse(config.data) : null;
            if (!payload || !payload.title || !payload.start || !payload.end) {
                return [400, {message: 'Missing required fields: title, start, end'}];
            }
            const newEvent = {
                id: getNextId(),
                title: String(payload.title),
                start: String(payload.start),
                end: String(payload.end),
                teacher: payload.teacher ? String(payload.teacher) : '',
                room: payload.room ? String(payload.room) : '',
                type: payload.type ? String(payload.type) : '',
            };
            _events.push(newEvent);
            return [201, {event: JSON.parse(JSON.stringify(newEvent))}];
        } catch (e) {
            console.warn(e);
            return [400, {message: 'Invalid payload'}];
        }
    });

    mockAdapter.onDelete(new RegExp('/api/events/\\d+$')).reply((config) => {
        try {
            const parts = config.url.split('/');
            const id = parseInt(parts[parts.length - 1], 10);
            const idx = _events.findIndex((e) => e.id === id);
            if (idx === -1) return [404, {message: 'Not found'}];
            _events.splice(idx, 1);
            return [204];
        } catch (e) {
            console.warn(e);
            return [400, {message: 'Invalid request'}];
        }
    });

    return mockAdapter;
}

export function restoreMock() {
    if (mockAdapter) {
        try {
            mockAdapter.restore && mockAdapter.restore();
        } catch (e) {
            console.warn(e);
        }
        mockAdapter = null;
        generatedMonths.clear();
    }
}

export async function fetchEvents() {
    const res = await axios.get('/api/events');
    return (res.data.events || []).map((e) => ({...e}));
}

export async function deleteEventById(id) {
    const res = await axios.delete(`/api/events/${id}`);
    return res.status === 204;
}
