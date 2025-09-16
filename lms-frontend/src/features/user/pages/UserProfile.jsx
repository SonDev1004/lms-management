import React, {useState, useMemo, useRef, useEffect} from 'react';
import {Card} from 'primereact/card';
import {Avatar} from 'primereact/avatar';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {Dropdown} from 'primereact/dropdown';
import {Divider} from 'primereact/divider';
import {Toast} from 'primereact/toast';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './UserProfile.css';

import axiosClient from '@/shared/api/axiosClient.js';
import {AppUrls} from "@/shared/constants/index.js";

const genderOptions = [
    {label: 'Nam', value: true},
    {label: 'Nữ', value: false}
];

export default function UserProfile() {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState(null);
    const [saving, setSaving] = useState(false);
    const toast = useRef(null);

    const fullName = useMemo(() => `${form?.firstName || ''} ${form?.lastName || ''}`.trim(), [form]);

    useEffect(() => {
        axiosClient.get(AppUrls.profile)
            .then(response => {
                console.log('API response', response)
                const payload = response?.data?.result ?? response?.data ?? {};
                setForm(payload);
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không lấy được hồ sơ',
                    life: 3000
                });
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{padding: 12}}>Đang tải dữ liệu hồ sơ...</p>;

    const labelForKey = (key) => {
        switch (key) {
            case 'firstName':
                return 'Tên';
            case 'lastName':
                return 'Họ';
            case 'dateOfBirth':
                return 'Ngày sinh';
            case 'gender':
                return 'Giới tính';
            case 'address':
                return 'Địa chỉ';
            case 'phone':
                return 'Điện thoại';
            default:
                return key;
        }
    };

    const isPhoneValid = (v) => {
        if (!v) return false;
        const cleaned = String(v).replace(/[^\d+]/g, '');
        return cleaned.length >= 8 && cleaned.length <= 15;
    };

    const getValidationError = (key, value) => {
        if (key === 'phone') {
            if (!value || String(value).trim().length === 0) return 'Số điện thoại không được để trống.';
            if (!isPhoneValid(value)) return 'Số điện thoại phải có 8–15 chữ số, có thể bắt đầu bằng +.';
            return null;
        }
        if (key === 'dateOfBirth') {
            if (!value) return 'Vui lòng chọn ngày.';
            return null;
        }
        if (key === 'gender') {
            if (value !== true && value !== false) return 'Vui lòng chọn giới tính.';
            return null;
        }
        if (value === null || value === undefined || String(value).trim().length === 0) {
            return `${labelForKey(key)} không được để trống.`;
        }
        return null;
    };

    const mockSaveApi = (key, value) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (key === 'phone' && !isPhoneValid(value)) {
                    reject(new Error('Định dạng số điện thoại không hợp lệ (máy chủ).'));
                } else {
                    resolve({ok: true, key, value});
                }
            }, 700);
        });
    };

    const startEdit = (key) => {
        if (saving) return;
        setEditingField(key);
        setTempValue(form?.[key] ?? (key === 'gender' ? null : ''));
    };

    const cancelEdit = () => {
        if (saving) return;
        setEditingField(null);
        setTempValue(null);
        toast.current?.show({severity: 'info', summary: 'Đã huỷ', detail: 'Đã hủy chỉnh sửa', life: 1500});
    };

    const saveEdit = async (key) => {
        const error = getValidationError(key, tempValue);
        if (error) {
            toast.current?.show({severity: 'warn', summary: 'Không hợp lệ', detail: error, life: 3500});
            return;
        }

        try {
            setSaving(true);
            const res = await mockSaveApi(key, tempValue);

            if (res && res.ok) {
                setForm((s) => ({...s, [key]: tempValue}));
                setEditingField(null);
                setTempValue(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Đã lưu',
                    detail: `${labelForKey(key)} đã được cập nhật.`,
                    life: 3000
                });
            } else {
                toast.current?.show({severity: 'error', summary: 'Lỗi', detail: 'Lưu thất bại', life: 4000});
            }
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: err?.message || 'Lưu thất bại',
                life: 4000
            });
        } finally {
            setSaving(false);
        }
    };

    const renderActions = (key, allowEdit = true) => {
        if (!allowEdit) return null;

        if (editingField === key) {
            const disabled = !!getValidationError(key, tempValue) || saving;
            return (
                <div className="action-buttons" style={{display: 'flex', gap: 8}}>
                    <Button
                        icon="pi pi-check"
                        className="p-button-rounded"
                        aria-label="Lưu"
                        onClick={() => saveEdit(key)}
                        disabled={disabled}
                        loading={saving}
                        loadingIcon="pi pi-spin pi-spinner"
                    />
                    <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-secondary"
                        aria-label="Hủy"
                        onClick={cancelEdit}
                        disabled={saving}
                    />
                </div>
            );
        }

        const editDisabled = saving || (editingField && editingField !== key);
        return (
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text edit-right"
                aria-label={`Chỉnh sửa ${labelForKey(key)}`}
                onClick={() => startEdit(key)}
                disabled={editDisabled}
            />
        );
    };

    const formatDisplayDate = (iso) => {
        if (!iso) return '-';
        try {
            const d = new Date(iso);
            return d.toLocaleDateString(undefined, {day: '2-digit', month: 'short', year: 'numeric'});
        } catch {
            return iso;
        }
    };

    return (
        <div className="user-profile-root p-m-4">
            <Toast ref={toast}/>
            <Card className="user-profile-card">
                <div className="user-profile-header p-d-flex p-flex-column p-ai-center">
                    <Avatar
                        image={form?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || form?.username || '')}`}
                        shape="circle"
                        size="xlarge"
                        className="user-avatar"
                        style={{width: 96, height: 96, objectFit: 'cover'}}
                    />
                    <div className="user-name-block p-text-center p-mt-3">
                        <div className="user-fullname" style={{fontWeight: 700, fontSize: '1.1rem'}}>
                            {fullName || form?.username}
                        </div>
                        <div className="user-username" style={{color: '#6b7280'}}>@{form?.username}</div>
                        <div className="user-role-wrap p-mt-2">
                            <div className="role-badge p-d-inline-flex p-ai-center">
                                <span className="role-icon" aria-hidden>🎓</span>
                                <span className="role-text">{(form?.role || 'Không xác định').toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="p-mt-4 p-mb-4"/>

                <div className="p-grid p-nogutter p-align-start p-justify-between">
                    {/* Personal */}
                    <div className="p-col-12 p-md-6 p-p-3">
                        <div className="p-text-sm p-text-bold p-mb-2">Thông tin cá nhân</div>
                        <div className="section-card">
                            <FieldRow
                                label="Tên"
                                icon="pi pi-user"
                                displayValue={form?.firstName}
                                editingField={editingField}
                                fieldKey="firstName"
                                tempValue={tempValue}
                                setTempValue={setTempValue}
                                renderActions={renderActions}
                                getValidationError={getValidationError}
                            />

                            <FieldRow
                                label="Họ"
                                icon="pi pi-id-card"
                                displayValue={form?.lastName}
                                editingField={editingField}
                                fieldKey="lastName"
                                tempValue={tempValue}
                                setTempValue={setTempValue}
                                renderActions={renderActions}
                                getValidationError={getValidationError}
                            />

                            <div className="field-row p-mb-3">
                                <div className="field-left">
                                    <div className="field-body">
                                        <label className="form-label"><i className="pi pi-calendar p-mr-2"/>Ngày sinh</label>
                                        {editingField !== 'dateOfBirth' ? (
                                            <div className="field-display">
                                                <span>{formatDisplayDate(form?.dateOfBirth)}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <Calendar
                                                    value={tempValue ? new Date(tempValue) : null}
                                                    onChange={(e) => setTempValue(e.value ? e.value.toISOString().slice(0, 10) : null)}
                                                    dateFormat="yy-mm-dd"
                                                    showIcon
                                                    maxDate={new Date()}
                                                    placeholder="YYYY-MM-DD"
                                                />
                                                {getValidationError('dateOfBirth', tempValue) &&
                                                    <small
                                                        className="field-error">{getValidationError('dateOfBirth', tempValue)}</small>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="field-actions">{renderActions('dateOfBirth')}</div>
                            </div>

                            <div className="field-row p-mb-3">
                                <div className="field-left">
                                    <div className="field-body">
                                        <label className="form-label"><i className="pi pi-male p-mr-2"/>Giới tính</label>
                                        {editingField !== 'gender' ? (
                                            <div className="field-display">
                                                <span>{form?.gender ? 'Nam' : 'Nữ'}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <Dropdown value={tempValue} options={genderOptions}
                                                          onChange={(e) => setTempValue(e.value)}
                                                          placeholder="Chọn giới tính"/>
                                                {getValidationError('gender', tempValue) &&
                                                    <small
                                                        className="field-error">{getValidationError('gender', tempValue)}</small>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="field-actions">{renderActions('gender')}</div>
                            </div>

                            <div className="field-row p-mb-3">
                                <div className="field-left">
                                    <div className="field-body">
                                        <label className="form-label"><i
                                            className="pi pi-map-marker p-mr-2"/>Địa chỉ</label>
                                        {editingField !== 'address' ? (
                                            <div className="field-display">
                                                <span title={form?.address || ''}>{form?.address || '-'}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <InputText value={tempValue || ''}
                                                           onChange={(e) => setTempValue(e.target.value)}/>
                                                {getValidationError('address', tempValue) &&
                                                    <small
                                                        className="field-error">{getValidationError('address', tempValue)}</small>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="field-actions">{renderActions('address')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="p-col-12 p-md-6 p-p-3">
                        <div className="p-text-sm p-text-bold p-mb-2">Liên hệ</div>
                        <div className="section-card">
                            <div className="field-row p-mb-3">
                                <div className="field-left" style={{flex: 1}}>
                                    <div className="field-body" style={{width: '100%'}}>
                                        <label className="form-label"><i
                                            className="pi pi-envelope p-mr-2"/>Email</label>
                                        <div className="field-display">
                                            <span title={form?.email || ''}>{form?.email || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="field-actions"/>
                            </div>

                            <div className="field-row p-mb-3">
                                <div className="field-left">
                                    <div className="field-body">
                                        <label className="form-label"><i className="pi pi-phone p-mr-2"/>Điện thoại</label>
                                        {editingField !== 'phone' ? (
                                            <div className="field-display">
                                                <span title={form?.phone || ''}>{form?.phone || '-'}</span>
                                            </div>
                                        ) : (
                                            <div>
                                                <InputText value={tempValue || ''}
                                                           onChange={(e) => setTempValue(e.target.value)}/>
                                                <div className="field-hint">Ví dụ: +84912345678 hoặc 0912345678</div>
                                                {getValidationError('phone', tempValue) &&
                                                    <small
                                                        className="field-error">{getValidationError('phone', tempValue)}</small>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="field-actions">{renderActions('phone')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function FieldRow({
                      label,
                      icon,
                      displayValue,
                      editingField,
                      fieldKey,
                      tempValue,
                      setTempValue,
                      renderActions,
                      getValidationError
                  }) {
    return (
        <div className="field-row p-mb-3">
            <div className="field-left">
                <div className="field-body">
                    <label className="form-label"><i className={icon + ' p-mr-2'}/>{label}</label>
                    {editingField !== fieldKey ? (
                        <div className="field-display">
                            <span title={displayValue || ''}>{displayValue || '-'}</span>
                        </div>
                    ) : (
                        <div>
                            <InputText value={tempValue || ''} onChange={(e) => setTempValue(e.target.value)}
                                       autoFocus/>
                            {getValidationError(fieldKey, tempValue) &&
                                <small className="field-error">{getValidationError(fieldKey, tempValue)}</small>
                            }
                        </div>
                    )}
                </div>
            </div>
            <div className="field-actions">{renderActions(fieldKey)}</div>
        </div>
    );
}
