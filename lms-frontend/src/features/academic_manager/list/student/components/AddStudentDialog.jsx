import React, { useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Formik } from 'formik';
import * as Yup from 'yup';

import '../styles/student-management.css';

import { classes, courses, studentStatusOptions } from '../mocks/students.js';

const genId = () => `STU${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

const makeSchema = (isEdit) =>
    Yup.object({
        id: Yup.string().required(),
        name: Yup.string().trim().min(2, 'Tên quá ngắn').max(80, 'Tên quá dài').matches(/^[\p{L} .'-]+$/u, 'Tên không hợp lệ').required('Bắt buộc'),
        email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
        phone: Yup.string().matches(/^(\+?84|0)(3|5|7|8|9)\d{8}$/, 'Số điện thoại VN không hợp lệ').required('Bắt buộc'),
        class: Yup.string().required('Bắt buộc'),
        status: Yup.string().required('Bắt buộc'),
        gpa: isEdit ? Yup.number().min(0).max(4).required('Bắt buộc') : Yup.number().min(0).max(4).nullable(),
        courses: Yup.array().of(Yup.string()).min(1, 'Chọn ít nhất 1 khoá'),
    });

export default function AddStudentDialog({ visible, onHide, defaultValues, onSave }) {
    const isEdit = !!defaultValues;

    const initialValues = useMemo(
        () =>
            defaultValues || {
                id: genId(),
                name: '',
                email: '',
                phone: '',
                class: classes?.[0]?.value ?? '',
                status: 'active',
                gpa: null,
                courses: [],
            },
        [visible, defaultValues]
    );

    const validationSchema = useMemo(() => makeSchema(isEdit), [isEdit]);

    const footer = (isSubmitting, isValid, dirty, handleSubmit, handleCancel) => (
        <div className="flex justify-content-end gap-2">
            <Button label="Cancel" text onClick={handleCancel(dirty)} />
            <Button label="Save" icon="pi pi-check" onClick={handleSubmit} loading={isSubmitting} disabled={!isValid || isSubmitting} />
        </div>
    );

    return (
        <>
            <Dialog header={defaultValues ? 'Edit Student' : 'Add Student'} visible={visible} style={{ width: '40rem' }} onHide={onHide} draggable={false} blockScroll>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        const cleaned = { ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() };
                        Promise.resolve(onSave?.(cleaned)).finally(() => setSubmitting(false));
                    }}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleSubmit, isSubmitting, isValid, dirty, resetForm }) => {
                        const invalid = (name) => touched[name] && errors[name];
                        const handleCancel = (formDirty) => () => {
                            if (!formDirty) return onHide?.();
                            confirmDialog({
                                message: 'Bỏ các thay đổi vừa nhập?',
                                header: 'Xác nhận',
                                icon: 'pi pi-exclamation-triangle',
                                acceptLabel: 'Bỏ thay đổi',
                                rejectLabel: 'Tiếp tục chỉnh',
                                acceptClassName: 'p-button-danger',
                                accept: () => {
                                    resetForm();
                                    onHide?.();
                                },
                            });
                        };

                        return (
                            <form onSubmit={handleSubmit} className="p-fluid">
                                <div className="formgrid grid">
                                    <div className="field col-12 md:col-6">
                                        <FloatLabel>
                                            <InputText id="id" value={values.id} readOnly />
                                            <label htmlFor="id">Student ID</label>
                                        </FloatLabel>
                                    </div>

                                    {isEdit && (
                                        <div className="field col-12 md:col-6">
                                            <FloatLabel>
                                                <InputNumber
                                                    id="gpa"
                                                    mode="decimal"
                                                    minFractionDigits={2}
                                                    maxFractionDigits={2}
                                                    min={0}
                                                    max={4}
                                                    value={values.gpa}
                                                    onValueChange={(e) => setFieldValue('gpa', e.value)}
                                                    className={invalid('gpa') ? 'p-invalid' : ''}
                                                />
                                                <label htmlFor="gpa">GPA</label>
                                            </FloatLabel>
                                            {invalid('gpa') && <small className="p-error">{errors.gpa}</small>}
                                        </div>
                                    )}

                                    <div className={`field ${isEdit ? 'col-12' : 'col-12 md:col-6'}`}>
                                        <FloatLabel>
                                            <InputText id="name" value={values.name} onChange={handleChange} className={invalid('name') ? 'p-invalid' : ''} autoFocus />
                                            <label htmlFor="name">Họ và tên *</label>
                                        </FloatLabel>
                                        {invalid('name') && <small className="p-error">{errors.name}</small>}
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <FloatLabel>
                                            <InputText id="email" value={values.email} onChange={handleChange} className={invalid('email') ? 'p-invalid' : ''} />
                                            <label htmlFor="email">Email *</label>
                                        </FloatLabel>
                                        {invalid('email') && <small className="p-error">{errors.email}</small>}
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <FloatLabel>
                                            <InputText id="phone" value={values.phone} onChange={handleChange} className={invalid('phone') ? 'p-invalid' : ''} />
                                            <label htmlFor="phone">Điện thoại *</label>
                                        </FloatLabel>
                                        {invalid('phone') && <small className="p-error">{errors.phone}</small>}
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <Dropdown
                                            className={`w-full ${invalid('class') ? 'p-invalid' : ''}`}
                                            value={values.class}
                                            onChange={(e) => setFieldValue('class', e.value)}
                                            options={classes}
                                            placeholder="Chọn lớp *"
                                            optionLabel="label"
                                            optionValue="value"
                                            filter
                                        />
                                        {invalid('class') && <small className="p-error">{errors.class}</small>}
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <Dropdown
                                            className={`w-full ${invalid('status') ? 'p-invalid' : ''}`}
                                            value={values.status}
                                            onChange={(e) => setFieldValue('status', e.value)}
                                            options={studentStatusOptions}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Trạng thái *"
                                        />
                                        {invalid('status') && <small className="p-error">{errors.status}</small>}
                                    </div>

                                    <div className="field col-12">
                                        <MultiSelect
                                            className={`w-full ${invalid('courses') ? 'p-invalid' : ''}`}
                                            value={values.courses}
                                            onChange={(e) => setFieldValue('courses', e.value)}
                                            options={courses}
                                            optionLabel="code"
                                            optionValue="code"
                                            placeholder="Chọn khoá học"
                                            display="chip"
                                            filter
                                        />
                                        {invalid('courses') && <small className="p-error">{errors.courses}</small>}
                                    </div>
                                </div>

                                <div className="mt-3">{footer(isSubmitting, isValid, dirty, handleSubmit, handleCancel)}</div>
                                <ConfirmDialog />
                            </form>
                        );
                    }}
                </Formik>
            </Dialog>
        </>
    );
}
