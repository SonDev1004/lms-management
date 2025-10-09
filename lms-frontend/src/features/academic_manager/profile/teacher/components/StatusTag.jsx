import { Tag } from 'primereact/tag';

const map = {
    active: { value: 'Active', severity: 'success' },
    inactive: { value: 'Inactive', severity: 'danger' },
    leave: { value: 'On Leave', severity: 'warning' }
};

export default function StatusTag({ value }) {
    const v = map[value] || { value, severity: 'info' };
    return <Tag value={v.value} severity={v.severity} rounded />;
}
