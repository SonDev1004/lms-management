import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Checkbox } from 'primereact/checkbox';

import axiosClient from '@/shared/api/axiosClient.js';
import urls from '@/shared/constants/urls.js';

import { PM, FALLBACK_VOUCHERS } from '@/features/payment/constants/payment';

import SummaryCard from '@/features/payment/components/SummaryCard';
import VoucherInput from '@/features/payment/components/VoucherInput';
import PaymentMethodPills from '@/features/payment/components/PaymentMethodPills';
import TotalsBox from '@/features/payment/components/TotalsBox';

import '@/features/payment/styles/enroll.css';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useRef(null);

    const selectedItem = location.state?.selectedItem;

    const [profileLoading, setProfileLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ fullName: '', email: '', phone: '', notes: '' });
    const [paymentMethod, setPaymentMethod] = useState(PM.CASH);
    const [agree, setAgree] = useState(false);

    const [voucher, setVoucher] = useState('');
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherApplied, setVoucherApplied] = useState(null);

    useEffect(() => {
        if (!selectedItem) {
            toast.current?.show({ severity: 'warn', summary: 'No data', detail: 'Please select a course to enroll.' });
            navigate('/');
            return;
        }
        loadProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItem]);

    const loadProfile = async () => {
        try {
            setProfileLoading(true);
            const res = await axiosClient.get(urls.profile);
            const profile = res.data?.result || res.data?.data || res.data || {};
            const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
            setForm({
                fullName: fullName || profile.username || '',
                email: profile.email || '',
                phone: profile.phone || '',
                notes: '',
            });
        } catch (e) {
            const msg = e.response?.data?.message || e.message || 'Failed to load user information.';
            toast.current?.show({ severity: 'error', summary: 'Error', detail: msg });
            if (e.response?.status === 401) setTimeout(() => navigate('/login'), 1200);
        } finally {
            setProfileLoading(false);
        }
    };

    const basePrice = Number(selectedItem?.price || 0);

    const discountAmount = useMemo(() => {
        if (!voucherApplied) return 0;
        if (voucherApplied.type === 'PERCENT') return Math.floor((basePrice * voucherApplied.value) / 100);
        if (voucherApplied.type === 'AMOUNT') return Math.min(basePrice, Number(voucherApplied.value || 0));
        return 0;
    }, [voucherApplied, basePrice]);

    const totalPay = useMemo(() => Math.max(0, basePrice - discountAmount), [basePrice, discountAmount]);

    const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

    const generateTxnRef = () => `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

    const applyVoucher = async () => {
        if (!voucher?.trim()) {
            setVoucherApplied(null);
            return;
        }
        try {
            setVoucherLoading(true);
            if (urls?.validateVoucher) {
                const res = await axiosClient.post(urls.validateVoucher, { code: voucher.trim(), amount: basePrice });
                const data = res.data?.result || res.data?.data || res.data;
                const applied = {
                    code: data.code || voucher.trim().toUpperCase(),
                    type: data.type || (data.percent ? 'PERCENT' : 'AMOUNT'),
                    value: data.value ?? data.percent ?? data.amountOff ?? 0,
                };
                setVoucherApplied(applied);
                toast.current?.show({ severity: 'success', summary: 'Voucher applied', detail: `Applied ${applied.code}` });
            } else {
                const found = FALLBACK_VOUCHERS[voucher.trim().toUpperCase()];
                if (!found) {
                    setVoucherApplied(null);
                    toast.current?.show({ severity: 'warn', summary: 'Invalid voucher', detail: 'Please check again.' });
                } else {
                    setVoucherApplied({ code: voucher.trim().toUpperCase(), ...found });
                    toast.current?.show({ severity: 'success', summary: 'Voucher applied', detail: found.label || 'Applied successfully' });
                }
            }
        } catch (e) {
            const msg = e.response?.data?.message || e.message || 'Could not apply voucher.';
            toast.current?.show({ severity: 'error', summary: 'Voucher error', detail: msg });
            setVoucherApplied(null);
        } finally {
            setVoucherLoading(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.phone) {
            toast.current?.show({ severity: 'warn', summary: 'Missing information', detail: 'Please fill in Full Name, Email, and Phone.' });
            return;
        }
        if (!agree) {
            toast.current?.show({ severity: 'warn', summary: 'Agreement required', detail: 'You need to accept the terms of use.' });
            return;
        }

        const payload = {
            programId: selectedItem.type === 'program' ? selectedItem.programId : null,
            subjectId: selectedItem.type === 'subject' ? selectedItem.subjectId : null,
            totalFee: totalPay,
            txnRef: generateTxnRef(),
            customer: { ...form },
            voucher: voucherApplied ? { code: voucherApplied.code, type: voucherApplied.type, value: voucherApplied.value } : null,
            paymentMethod,
        };

        try {
            setLoading(true);
            const res = await axiosClient.post(urls.payment, payload);
            const data = res.data?.result || res.data?.data || res.data;
            if (data?.paymentUrl) { window.location.href = data.paymentUrl; return; }
            toast.current?.show({ severity: 'success', summary: 'Enrollment Successful', detail: data?.message || 'You have successfully enrolled.' });
            setTimeout(() => navigate('/my-enrollments'), 1000);
        } catch (e) {
            const msg = e.response?.data?.message || e.message || 'An error occurred during registration.';
            toast.current?.show({ severity: 'error', summary: 'Enrollment Failed', detail: msg });
            if (e.response?.status === 401) setTimeout(() => navigate('/login'), 1200);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedItem) return null;

    if (profileLoading) {
        return (
            <div className="full-center">
                <ProgressSpinner />
                <span className="ml-3">Loading user information...</span>
            </div>
        );
    }

    return (
        <div className="page-payment">
            <Toast ref={toast} />

            <header className="enroll-head">
                <h1 className="enroll-title">Course Enrollment</h1>
                <p className="enroll-sub">Please complete the information below to enroll. We will contact you within 24 hours.</p>
            </header>

            <section className="enroll-grid">
                <aside className="enroll-left">
                    <SummaryCard selectedItem={selectedItem} basePrice={basePrice} />
                </aside>

                <main className="enroll-right">
                    <Card title="Thông tin đăng ký" className="card-right">
                        <form onSubmit={submit} className="form-grid">
                            <label className="p-field">
                                <span>Full Name <b className="req">*</b></span>
                                <InputText className="ctrl" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Nhập họ và tên đầy đủ" />
                            </label>

                            <label className="p-field">
                                <span>Email <b className="req">*</b></span>
                                <InputText type="email" className="ctrl" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="example@email.com" />
                            </label>

                            <label className="p-field">
                                <span>Phone <b className="req">*</b></span>
                                <InputText className="ctrl" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="0123456789" />
                            </label>

                            <label className="p-field">
                                <span>Notes</span>
                                <InputTextarea className="ctrl" rows={4} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Additional notes or special learning requirements...." />
                            </label>

                            <VoucherInput
                                voucher={voucher}
                                setVoucher={setVoucher}
                                voucherApplied={voucherApplied}
                                voucherLoading={voucherLoading}
                                onApply={applyVoucher}
                            />

                            <PaymentMethodPills value={paymentMethod} onChange={setPaymentMethod} />

                            <Divider className="my-2" />

                            <div className="agree-row">
                                <Checkbox inputId="agree" checked={agree} onChange={(e) => setAgree(e.checked)} />
                                <label htmlFor="agree">
                                    I agree to the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>.
                                </label>
                            </div>

                            <TotalsBox basePrice={basePrice} discountAmount={discountAmount} totalPay={totalPay} />

                            <Button type="submit" label={loading ? 'Processing...' : 'Enroll Now'} icon={loading ? '' : 'pi pi-check'} className="btn-submit" disabled={loading} />
                            {loading && <div className="spin-center"><ProgressSpinner style={{ width: 30, height: 30 }} strokeWidth="4" /></div>}
                        </form>
                    </Card>
                </main>
            </section>
        </div>
    );
}
