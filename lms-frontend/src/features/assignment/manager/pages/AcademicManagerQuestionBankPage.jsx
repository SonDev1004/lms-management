import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import axiosClient from "@/shared/api/axiosClient.js";
import { AppUrls } from "@/shared/constants/index.js";

export default function AcademicManagerQuestionBankPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [keyword, setKeyword] = useState("");
    const [subject, setSubject] = useState(null);
    const [type, setType] = useState(null);

    const [formVisible, setFormVisible] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        content: "",
        options: ["", "", "", ""],
        correctKey: "0",
        subjectId: null,
        level: "",
    });

    const [toastRef] = useState(null);

    useEffect(() => {
        loadQuestionBank();
    }, []);

    const loadQuestionBank = async () => {
        try {
            setLoading(true);
            const params = {
                keyword: keyword || undefined,
                subjectId: subject?.value || undefined,
                type: type?.value || undefined,
                page: 0,
                size: 50,
            };
            const res = await axiosClient.get(
                AppUrls.questionBankList,
                { params }
            );
            const apiRes = res.data || {};
            const payload = apiRes.result ?? apiRes.data ?? {};
            const list = payload.content || payload.items || payload || [];
            setItems(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = (row) => {
        confirmDialog({
            header: "Deactivate question",
            message: `Ẩn câu hỏi #${row.id}?`,
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Deactivate",
            rejectLabel: "Cancel",
            accept: async () => {
                try {
                    await axiosClient.delete(
                        AppUrls.questionBankDeactivate(row.id)
                    );
                    toastRef?.show({
                        severity: "success",
                        summary: "Updated",
                        detail: "Question deactivated",
                    });
                    await loadQuestionBank();
                } catch (e) {
                    console.error(e);
                    toastRef?.show({
                        severity: "error",
                        summary: "Error",
                        detail: "Không cập nhật được câu hỏi",
                    });
                }
            },
        });
    };

    const openCreateForm = () => {
        setFormData({
            content: "",
            options: ["", "", "", ""],
            correctKey: "0",
            subjectId: null,
            level: "",
        });
        setFormVisible(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            const payload = {
                subjectId: formData.subjectId,
                content: formData.content,
                options: formData.options.map((text, idx) => ({
                    key: String(idx),
                    text,
                })),
                correctKey: formData.correctKey,
                level: formData.level,
                tags: [],
            };
            await axiosClient.post(
                AppUrls.questionBankCreateMcq,
                payload
            );
            toastRef?.show({
                severity: "success",
                summary: "Created",
                detail: "Question created",
            });
            setFormVisible(false);
            await loadQuestionBank();
        } catch (e) {
            console.error(e);
            toastRef?.show({
                severity: "error",
                summary: "Error",
                detail: "Không tạo được câu hỏi",
            });
        } finally {
            setFormLoading(false);
        }
    };

    const typeOptions = [
        { label: "MCQ Single", value: 1 },
        // các type khác nếu BE có mapping
    ];

    return (
        <div className="page-wrap">
            <Toast ref={toastRef} />
            <ConfirmDialog />
            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-database title-icon" />
                    <div>
                        <h2 className="title">Question Bank</h2>
                        <p className="subtitle">
                            Quản lý ngân hàng câu hỏi cho toàn trung tâm.
                        </p>
                    </div>
                </div>

                <Button
                    label="New MCQ Single"
                    icon="pi pi-plus"
                    onClick={openCreateForm}
                />
            </div>

            <Card>
                <div className="flex gap-2 mb-3">
                    <span className="p-input-icon-left flex-1">
                        <i className="pi pi-search" />
                        <InputText
                            placeholder="Search content..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    loadQuestionBank();
                                }
                            }}
                        />
                    </span>
                    <Dropdown
                        value={subject}
                        options={[]}
                        onChange={(e) => setSubject(e.value)}
                        placeholder="Subject"
                        className="w-14rem"
                    />
                    <Dropdown
                        value={type}
                        options={typeOptions}
                        onChange={(e) => setType(e.value)}
                        placeholder="Type"
                        className="w-12rem"
                    />
                    <Button
                        label="Filter"
                        icon="pi pi-filter"
                        onClick={loadQuestionBank}
                    />
                </div>

                <DataTable
                    value={items}
                    loading={loading}
                    size="small"
                    stripedRows
                    responsiveLayout="scroll"
                >
                    <Column field="id" header="ID" style={{ width: "6rem" }} />
                    <Column
                        field="contentPreview"
                        header="Content"
                        body={(row) => row.contentPreview || row.content}
                    />
                    <Column
                        field="subjectName"
                        header="Subject"
                        style={{ width: "10rem" }}
                    />
                    <Column
                        field="level"
                        header="Level"
                        style={{ width: "8rem" }}
                    />
                    <Column
                        header="Status"
                        body={(row) => (
                            <Tag
                                value={row.active ? "Active" : "Inactive"}
                                severity={row.active ? "success" : "danger"}
                            />
                        )}
                        style={{ width: "8rem" }}
                    />
                    <Column
                        header=""
                        body={(row) => (
                            <Button
                                icon="pi pi-eye-slash"
                                rounded
                                text
                                severity="danger"
                                onClick={() => handleDeactivate(row)}
                            />
                        )}
                        style={{ width: "4rem" }}
                    />
                </DataTable>
            </Card>

            <Dialog
                header="New MCQ Single"
                visible={formVisible}
                style={{ width: "600px" }}
                onHide={() => {
                    if (formLoading) return;
                    setFormVisible(false);
                }}
            >
                <form
                    className="grid formgrid p-fluid"
                    onSubmit={handleSubmitForm}
                >
                    <div className="field col-12">
                        <label className="font-semibold">
                            Question content
                        </label>
                        <InputText
                            value={formData.content}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    content: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    {formData.options.map((opt, idx) => (
                        <div className="field col-12" key={idx}>
                            <label className="font-semibold">
                                Option {idx + 1}
                            </label>
                            <InputText
                                value={opt}
                                onChange={(e) =>
                                    setFormData((prev) => {
                                        const options = [...prev.options];
                                        options[idx] = e.target.value;
                                        return { ...prev, options };
                                    })
                                }
                                required
                            />
                        </div>
                    ))}

                    <div className="field col-12 md:col-6">
                        <label className="font-semibold">
                            Correct option
                        </label>
                        <Dropdown
                            value={formData.correctKey}
                            options={[
                                { label: "Option 1", value: "0" },
                                { label: "Option 2", value: "1" },
                                { label: "Option 3", value: "2" },
                                { label: "Option 4", value: "3" },
                            ]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    correctKey: e.value,
                                }))
                            }
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label className="font-semibold">Level</label>
                        <InputText
                            value={formData.level}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    level: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {/* SubjectId bạn có thể thay bằng dropdown subject thực tế */}
                    <div className="field col-12">
                        <label className="font-semibold">Subject ID</label>
                        <InputText
                            value={formData.subjectId || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    subjectId: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                }))
                            }
                        />
                    </div>

                    <div className="col-12 flex justify-content-end gap-2 mt-3">
                        <Button
                            type="button"
                            label="Cancel"
                            outlined
                            onClick={() => setFormVisible(false)}
                            disabled={formLoading}
                        />
                        <Button
                            type="submit"
                            label={formLoading ? "Saving..." : "Save"}
                            icon="pi pi-check"
                            disabled={formLoading}
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
