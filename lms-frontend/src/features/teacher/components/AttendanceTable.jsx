import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext';

const AttendanceTable = ({
	attendanceList,
	attendance_types,
	handleAttendanceChange,
	handleReasonChange,
	renderFooter
}) => {
	return (
		<DataTable
			showGridlines
			stripedRows
			value={attendanceList}
			tableStyle={{ minWidth: '25rem' }}
			paginator
			rows={10}
		>
			<Column
				header='STT'
				body={(rowData, options) => options.rowIndex + 1}
				style={{ width: '2.5%' }}
			></Column>
			<Column
				field='code'
				header='Mã học viên'
				headerStyle={{ whiteSpace: 'nowrap', textAlign: 'center' }}
				style={{ width: '10%' }}
			></Column>
			<Column
				field='name'
				header='Tên học viên'
				body={rowData => `${rowData.firstname} ${rowData.lastname}`}
				footer='Tổng'
				style={{ width: '20%' }}
			/>
			{attendance_types.map(type => (
				<Column
					key={type.value}
					header={type.label}
					headerStyle={{ whiteSpace: 'nowrap', textAlign: 'center' }}
					bodyStyle={{ textAlign: 'center', verticalAlign: 'middle' }}
					body={rowData => (
						<RadioButton
							inputId={`${type.value}-${rowData.id}`}
							name={`attendance-${rowData.id}`}
							value={type.value}
							onChange={() =>
								handleAttendanceChange(rowData.id, type.value)
							}
							checked={rowData.attendance == type.value}
						/>
					)}
					footer={renderFooter(type.value)}
				/>
			))}
			<Column
				field='reasonAbsent'
				header='Lý do vắng'
				body={(rowData, options) => (
					<InputText
						value={rowData.reasonAbsent || ''}
						onChange={e =>
							handleReasonChange(e.target.value, options.rowIndex)
						}
						placeholder='Lý do vắng'
						disabled={rowData.attendance !== 'Absent'}
					/>
				)}
			/>
		</DataTable>
	);
};

export default AttendanceTable;
