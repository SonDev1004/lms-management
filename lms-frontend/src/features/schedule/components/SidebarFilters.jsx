
import React from 'react';
import { Card } from 'primereact/card';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

export default function SidebarFilters({ filters, setFilters, teacherOptions, typeOptions, onApply, onClear, appliedCount }) {
    return (
        <Card className="filter-card p-mb-3">
            <div className="p-d-flex p-flex-column">
                <div className="p-d-flex p-ai-center p-jc-between p-mb-2">
                    <div className="p-d-flex p-ai-center p-gap-2">
                        <i className="pi pi-filter" />
                        <strong>Bộ lọc</strong>
                        {appliedCount > 0 && <span className="applied-badge">{appliedCount}</span>}
                    </div>
                </div>

                <div className="p-grid p-mb-2 p-mt-2">
                    <div className="p-col-12">
                        <label className="p-mb-1">Loại lớp</label>
                        <MultiSelect value={filters.types} options={typeOptions}
                                     onChange={(e) => setFilters((s) => ({ ...s, types: e.value }))}
                                     placeholder="Chọn loại (có thể chọn nhiều)" display="chip" showClear />
                    </div>
                    <div className="p-col-12">
                        <label className="p-mb-1">Giáo viên</label>
                        <MultiSelect value={filters.teachers} options={teacherOptions}
                                     onChange={(e) => setFilters((s) => ({ ...s, teachers: e.value }))}
                                     placeholder="Chọn giáo viên (có thể chọn nhiều)" display="chip" showClear />
                    </div>
                </div>

                <div className="p-d-flex p-jc-between p-ai-center p-pt-2">
                    <div className="p-d-flex p-gap-2">
                        <Button icon="pi pi-check" label="Áp dụng" onClick={onApply} className="p-button-apply" />
                        <Button icon="pi pi-times" label="Xoá" onClick={onClear} className="p-button-clear" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
