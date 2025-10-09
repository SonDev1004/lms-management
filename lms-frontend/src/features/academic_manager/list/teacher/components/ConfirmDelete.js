import { confirmDialog } from "primereact/confirmdialog";

export function confirmDelete({ name = "this item", onAccept, onReject, message }) {
    confirmDialog({
        header: "Confirm Delete",
        message: message ?? `Are you sure you want to delete ${name}?`,
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClassName: "p-button-danger",
        accept: onAccept,
        reject: onReject,
    });
}