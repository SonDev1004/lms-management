import React from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Tag} from 'primereact/tag';
import {Card} from 'primereact/card';

const AttendanceTable = ({attendanceHistory, formatDate}) => {
    return (
        <div className="attendance-summary p-mt-2">
            <div className="p-mb-3 p-text-bold">
                Có mặt: {attendanceHistory.filter(a => a.present).length} •
                Vắng: {attendanceHistory.filter(a => !a.present).length}
            </div>

            <Card>
                <DataTable value={attendanceHistory} responsiveLayout="scroll" className="p-mt-2">
                    <Column field="session" header="Buổi"/>
                    <Column field="date" header="Ngày" body={(row) => formatDate(row.date)}/>
                    <Column
                        header="Trạng thái"
                        body={(row) => row.present ? <Tag value="Có mặt" severity="success"/> :
                            <Tag value="Vắng" severity="danger"/>}
                    />
                </DataTable>
            </Card>
        </div>
    );
};

export default AttendanceTable;
