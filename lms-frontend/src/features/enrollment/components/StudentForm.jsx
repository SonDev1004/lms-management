// src/features/enrollment/components/StudentForm.jsx
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const StudentForm = ({ formData, errors, setFormData, onBack, onNext }) => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Thông Tin Học Viên</h2>
            <div className="grid">
                <div className="col-12 md:col-6">
                    <label htmlFor="name" className="block text-900 font-medium mb-2">Họ và tên *</label>
                    <InputText id="name" value={formData.name}
                               onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                               className={`w-full ${errors.name ? 'p-invalid' : ''}`} placeholder="Nhập họ và tên" />
                    {errors.name && <small className="p-error">{errors.name}</small>}
                </div>
                <div className="col-12 md:col-6">
                    <label htmlFor="phone" className="block text-900 font-medium mb-2">Số điện thoại *</label>
                    <InputText id="phone" value={formData.phone}
                               onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                               className={`w-full ${errors.phone ? 'p-invalid' : ''}`} placeholder="Nhập số điện thoại" />
                    {errors.phone && <small className="p-error">{errors.phone}</small>}
                </div>
                <div className="col-12">
                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email *</label>
                    <InputText id="email" value={formData.email}
                               onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                               className={`w-full ${errors.email ? 'p-invalid' : ''}`} placeholder="Nhập địa chỉ email" />
                    {errors.email && <small className="p-error">{errors.email}</small>}
                </div>
            </div>

            <div className="flex justify-content-between mt-4">
                <Button label="Quay lại" icon="pi pi-arrow-left" outlined onClick={onBack} />
                <Button label="Tiếp tục" icon="pi pi-arrow-right" onClick={onNext} />
            </div>
        </>
    );
};

export default StudentForm;
