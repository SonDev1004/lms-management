import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {InputNumber} from "primereact/inputnumber";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {Tag} from "primereact/tag";
import {Toast} from "primereact/toast";

import axiosClient from "@/shared/api/axiosClient.js";
import {AppUrls} from "@/shared/constants/index.js";
import {
    fetchAssignmentQuizConfig,
    saveAssignmentQuizConfig,
} from "@/features/assignment/api/assignmentService.js";

export default function TeacherQuizBuilderPage() {
    const {assignmentId} = useParams();

    const [config, setConfig] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingConfig, setLoadingConfig] = useState(false);
    const [saving, setSaving] = useState(false);

    const [bankVisible, setBankVisible] = useState(false);
    const [bankList, setBankList] = useState([]);
    const [bankLoading, setBankLoading] = useState(false);
    const [bankKeyword, setBankKeyword] = useState("");
    const [bankSubject, setBankSubject] = useState(null);
    const [bankSelection, setBankSelection] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);

    const toastRef = useState(null);
    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const res = await axiosClient.get(AppUrls.subjectList);
            const apiRes = res.data || {};
            const payload = apiRes.result ?? apiRes.data ?? apiRes ?? [];
            const list = Array.isArray(payload) ? payload : payload.content || [];

            const opts = list.map((s) => ({
                label: s.name || s.title,
                value: s.id,
            }));
            setSubjectOptions(opts);
        } catch (e) {
            console.error("Failed to load subjects", e);
        }
    };

    useEffect(() => {
        if (!assignmentId || assignmentId === "null") return;
        loadConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignmentId]);

    const loadConfig = async () => {
        try {
            setLoadingConfig(true);
            const data = await fetchAssignmentQuizConfig(assignmentId);
            setConfig(data);
            setItems(data.items || []);
        } catch (e) {
            console.error("Failed to load quiz config", e);
        } finally {
            setLoadingConfig(false);
        }
    };

    const handleChangePoints = (row, points) => {
        setItems((prev) =>
            prev.map((it) =>
                it.questionId === row.questionId ? {...it, points} : it
            )
        );
    };

    const handleChangeOrder = (row, orderNumber) => {
        setItems((prev) =>
            prev.map((it) =>
                it.questionId === row.questionId ? {...it, orderNumber} : it
            )
        );
    };

    const handleRemoveItem = (row) => {
        setItems((prev) =>
            prev.filter((it) => it.questionId !== row.questionId)
        );
    };

    const openQuestionBank = () => {
        setBankVisible(true);
        loadQuestionBank();
    };

    const loadQuestionBank = async () => {
        try {
            setBankLoading(true);
            const params = {
                keyword: bankKeyword || undefined,
                subjectId: bankSubject?.value || undefined,
                page: 0,
                size: 50,
            };
            const res = await axiosClient.get(AppUrls.questionBankList, {
                params,
            });
            const apiRes = res.data || {};
            const payload = apiRes.result ?? apiRes.data ?? {};
            const list = payload.content || payload.items || payload || [];
            setBankList(list);
        } catch (e) {
            console.error("Failed to load question bank", e);
        } finally {
            setBankLoading(false);
        }
    };

    const handleAddFromBank = () => {
        const existingIds = new Set(items.map((it) => it.questionId));
        const maxOrder =
            items.reduce(
                (max, it) => Math.max(max, it.orderNumber || 0),
                0
            ) || 0;

        let order = maxOrder;
        const newItems = bankSelection
            .filter((q) => !existingIds.has(q.id))
            .map((q) => {
                order += 1;
                return {
                    id: null,
                    questionId: q.id,
                    orderNumber: order,
                    points: 1,
                    content: q.contentPreview || q.content,
                    type: q.type,
                };
            });

        setItems((prev) => [...prev, ...newItems]);
        setBankVisible(false);
        setBankSelection([]);
    };

    const handleSaveConfig = async () => {
        if (!assignmentId || assignmentId === "null") {
            console.error("assignmentId is null, cannot save config");
            return;
        }
        try {
            setSaving(true);
            await saveAssignmentQuizConfig(assignmentId, items);
            toastRef?.show({
                severity: "success",
                summary: "Saved",
                detail: "Quiz configuration saved",
            });
            await loadConfig();
        } catch (e) {
            console.error(e);
            toastRef?.show({
                severity: "error",
                summary: "Error",
                detail: "Không lưu được cấu hình quiz",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-wrap">
            <Toast ref={toastRef}/>
            <div className="header-row">
                <div className="title-block">
                    <i className="pi pi-list-check title-icon"/>
                    <div>
                        <h2 className="title">
                            Quiz Builder – Assignment #{assignmentId}
                        </h2>
                        <p className="subtitle">
                            Chọn câu hỏi từ ngân hàng đề và cấu hình điểm / thứ tự.
                        </p>
                    </div>
                </div>

                <div className="flex align-items-center gap-2">
                    <Button
                        label={saving ? "Saving..." : "Save config"}
                        icon="pi pi-save"
                        onClick={handleSaveConfig}
                        disabled={saving}
                    />
                </div>
            </div>

            <Card>
                <div className="flex justify-content-between align-items-center mb-3">
                    <div>
                        <h3 className="m-0">Assigned questions</h3>
                        <p className="text-sm text-muted-color m-0">
                            Total: {items.length} questions
                        </p>
                    </div>
                    <Button
                        label="Add from Question Bank"
                        icon="pi pi-plus"
                        onClick={openQuestionBank}
                    />
                </div>

                <DataTable
                    value={items}
                    loading={loadingConfig}
                    dataKey="questionId"
                    size="small"
                    stripedRows
                    responsiveLayout="scroll"
                >
                    <Column
                        field="orderNumber"
                        header="#"
                        body={(row) => (
                            <InputNumber
                                value={row.orderNumber}
                                onValueChange={(e) =>
                                    handleChangeOrder(row, e.value)
                                }
                                min={1}
                                max={999}
                                inputStyle={{width: "4rem"}}
                            />
                        )}
                        style={{width: "6rem"}}
                    />
                    <Column
                        field="content"
                        header="Content"
                        body={(row) => (
                            <div className="flex flex-column gap-1">
                                <span>{row.content}</span>
                                <Tag
                                    value={`QID: ${row.questionId}`}
                                    severity="secondary"
                                    className="text-xs"
                                />
                            </div>
                        )}
                    />
                    <Column
                        field="points"
                        header="Points"
                        body={(row) => (
                            <InputNumber
                                value={row.points}
                                onValueChange={(e) =>
                                    handleChangePoints(row, e.value)
                                }
                                min={0}
                                max={100}
                                inputStyle={{width: "4rem"}}
                            />
                        )}
                        style={{width: "8rem"}}
                    />
                    <Column
                        header=""
                        body={(row) => (
                            <Button
                                icon="pi pi-trash"
                                rounded
                                text
                                severity="danger"
                                onClick={() => handleRemoveItem(row)}
                            />
                        )}
                        style={{width: "4rem"}}
                    />
                </DataTable>
            </Card>

            {/* Question bank dialog */}
            <Dialog
                header="Question Bank"
                visible={bankVisible}
                style={{width: "900px"}}
                onHide={() => setBankVisible(false)}
            >
                <div className="flex gap-2 mb-3">
                    <span className="p-input-icon-left flex-1">
                        <i className="pi pi-search"/>
                        <InputText
                            placeholder="Search content..."
                            value={bankKeyword}
                            onChange={(e) => setBankKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    loadQuestionBank();
                                }
                            }}
                        />
                    </span>
                    <Dropdown
                        value={bankSubject}
                        options={subjectOptions}
                        onChange={(e) => setBankSubject(e.value)}
                        placeholder="Subject"
                        className="w-12rem"
                    />
                    <Button
                        label="Filter"
                        icon="pi pi-filter"
                        onClick={loadQuestionBank}
                    />
                </div>

                <DataTable
                    value={bankList}
                    loading={bankLoading}
                    selection={bankSelection}
                    onSelectionChange={(e) => setBankSelection(e.value)}
                    dataKey="id"
                    size="small"
                    responsiveLayout="scroll"
                >
                    <Column
                        selectionMode="multiple"
                        headerStyle={{width: "4rem"}}
                    />
                    <Column field="id" header="ID" style={{width: "6rem"}}/>
                    <Column
                        field="contentPreview"
                        header="Content"
                        body={(row) => row.contentPreview || row.content}
                    />
                    <Column
                        field="subjectName"
                        header="Subject"
                        style={{width: "10rem"}}
                    />
                    <Column
                        field="level"
                        header="Level"
                        style={{width: "8rem"}}
                    />
                </DataTable>

                <div className="flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Cancel"
                        outlined
                        onClick={() => setBankVisible(false)}
                    />
                    <Button
                        label="Add selected"
                        icon="pi pi-plus"
                        onClick={handleAddFromBank}
                        disabled={!bankSelection.length}
                    />
                </div>
            </Dialog>
        </div>
    );
}
