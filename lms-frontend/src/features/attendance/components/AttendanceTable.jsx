import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';

import '../styles/Attendance.css';

const AttendanceTable = ({ attendanceHistory, formatDate }) => {
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');

    const normalized = useMemo(() => {
        return attendanceHistory.map((r) => {
            const dateStr = formatDate(r.date);
            return { ...r, _dateStr: dateStr };
        });
    }, [attendanceHistory, formatDate]);

    const filtered = useMemo(() => {
        return normalized.filter((r) => {
            if (filter === 'present' && !r.present) return false;
            if (filter === 'absent' && r.present) return false;
            if (!query) return true;
            return r._dateStr.includes(query) || String(r.session).includes(query);
        });
    }, [normalized, filter, query]);

    const presentCount = attendanceHistory.filter((a) => a.present).length;
    const absentCount = attendanceHistory.filter((a) => !a.present).length;

    const statusBody = (row) => (
        <span className={`status-badge ${row.present ? 'present' : 'absent'}`}>
      {row.present ? '✔ Có mặt' : '✖ Vắng'}
    </span>
    );

    const dateBody = (row) => <div className="date-cell">{formatDate(row.date)}</div>;

    const header = (
        <div className="table-header">
            <div className="controls">
                <div className="filter-group">
                    <label className="sr-only">Lọc</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tất cả</option>
                        <option value="present">Chỉ Có mặt</option>
                        <option value="absent">Chỉ Vắng</option>
                    </select>
                </div>

                <div className="search-group">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                placeholder="Tìm theo ngày (vd: 01/06/2025) hoặc buổi"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
          </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="attendance-container">
            <div className="summary">
                <div className="summary-item present">
                    <div className="summary-label">Có mặt</div>
                    <div className="summary-value">{presentCount}</div>
                </div>
                <div className="summary-item absent">
                    <div className="summary-label">Vắng</div>
                    <div className="summary-value">{absentCount}</div>
                </div>
                <div className="summary-spacer" />
            </div>

            <Card className="attendance-card">
                <div className="attendance-card-inner">
                    <div className="table-title">Lịch sử điểm danh</div>

                    <DataTable
                        value={filtered}
                        responsiveLayout="scroll"
                        header={header}
                        className="attendance-table"
                        emptyMessage="Không có dữ liệu"
                        paginator
                        rows={8}
                    >
                        <Column field="session" header="Buổi" style={{ width: '8%' }} />
                        <Column header="Ngày" body={dateBody} style={{ width: '30%' }} />
                        <Column header="Trạng thái" body={statusBody} style={{ width: '20%' }} />
                    </DataTable>
                </div>
            </Card>
        </div>
    );
};

AttendanceTable.propTypes = {
    attendanceHistory: PropTypes.array.isRequired,
    formatDate: PropTypes.func.isRequired,
};

export default AttendanceTable;
