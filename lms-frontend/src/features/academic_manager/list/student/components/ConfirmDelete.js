import { confirmDialog } from 'primereact/confirmdialog';

export const confirmDelete = ({ title = 'Delete student', name, onAccept }) =>
    confirmDialog({
        header: title,
        message: `Remove ${name}?`,
        acceptClassName: 'p-button-danger',
        icon: 'pi pi-exclamation-triangle',
        accept: onAccept,
    });
