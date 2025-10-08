import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';

const AttendanceTeacherTable = ({
    attendanceList,
    attendance_types,
    handleAttendanceChange,
    handleReasonChange,
    renderFooter
}) => {
    return (
        <DataTable
            value={attendanceList}
            dataKey="id"
            showGridlines
            stripedRowsz
            tableStyle={{ minWidth: '25rem' }}
            paginator
            rows={10}
        >
            <Column header="STT" body={(_, options) => options.rowIndex + 1} style={{ width: '4%' }} />
            <Column field="code" header="Mã học viên" headerStyle={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                style={{ width: '14%' }} />
            <Column
                header="Tên học viên"
                body={(row) => `${row.firstname ?? ''} ${row.lastname ?? ''}`}
                footer="Tổng"
                style={{ width: '22%' }}
            />

            {attendance_types.map((type) => (
                <Column
                    key={type.value}
                    header={type.label}
                    headerStyle={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                    bodyStyle={{ textAlign: 'center', verticalAlign: 'middle' }}
                    body={(row) => (
                        <RadioButton
                            inputId={`${type.value}-${row.id}`}
                            name={`attendance-${row.id}`}
                            value={type.value}
                            onChange={() => handleAttendanceChange(row.id, type.value)}
                            checked={Number(row.attendance) === Number(type.value)}
                        />
                    )}
                    footer={renderFooter ? renderFooter(type.value) : null}
                />
            ))}

            <Column
                header="Lý do vắng"
                body={(row) => {
                    const att = Number(row.attendance);
                    const canEdit = [0, 2].includes(att); // 0: Vắng, 2: Đi trễ (đổi theo nhu cầu)
                    return (
                        <InputText
                            className="w-full"
                            placeholder="Lý do vắng"
                            value={row.note ?? ''}
                            onChange={(e) => handleReasonChange(row.id, e.target.value)}
                            disabled={!canEdit}
                        />
                    );
                }}
            />
        </DataTable>
    );
};

export default AttendanceTeacherTable;
