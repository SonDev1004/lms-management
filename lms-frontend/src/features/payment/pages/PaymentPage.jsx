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
            toast.current?.show({ severity: 'warn', summary: 'Không có dữ liệu', detail: 'Vui lòng chọn khóa học để đăng ký.' });
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
            const msg = e.response?.data?.message || e.message || 'Không thể tải thông tin người dùng.';
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: msg });
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
                toast.current?.show({ severity: 'success', summary: 'Áp dụng mã', detail: `Đã áp dụng ${applied.code}` });
            } else {
                const found = FALLBACK_VOUCHERS[voucher.trim().toUpperCase()];
                if (!found) {
                    setVoucherApplied(null);
                    toast.current?.show({ severity: 'warn', summary: 'Mã không hợp lệ', detail: 'Vui lòng kiểm tra lại.' });
                } else {
                    setVoucherApplied({ code: voucher.trim().toUpperCase(), ...found });
                    toast.current?.show({ severity: 'success', summary: 'Áp dụng mã', detail: found.label || 'Áp dụng thành công' });
                }
            }
        } catch (e) {
            const msg = e.response?.data?.message || e.message || 'Không thể áp dụng mã giảm giá.';
            toast.current?.show({ severity: 'error', summary: 'Lỗi voucher', detail: msg });
            setVoucherApplied(null);
        } finally {
            setVoucherLoading(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!form.fullName || !form.email || !form.phone) {
            toast.current?.show({ severity: 'warn', summary: 'Thiếu thông tin', detail: 'Vui lòng điền đủ Họ tên, Email, SĐT.' });
            return;
        }
        if (!agree) {
            toast.current?.show({ severity: 'warn', summary: 'Chưa đồng ý điều khoản', detail: 'Bạn cần đồng ý điều khoản sử dụng.' });
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
            toast.current?.show({ severity: 'success', summary: 'Đăng ký thành công', detail: data?.message || 'Bạn đã đăng ký thành công.' });
            setTimeout(() => navigate('/my-enrollments'), 1000);
        } catch (e) {
            const msg = e.response?.data?.message || e.message || 'Có lỗi xảy ra khi đăng ký.';
            toast.current?.show({ severity: 'error', summary: 'Đăng ký thất bại', detail: msg });
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
                <span className="ml-3">Đang tải thông tin người dùng...</span>
            </div>
        );
    }

    return (
        <div className="page-payment">
            <Toast ref={toast} />

            <header className="enroll-head">
                <h1 className="enroll-title">Đăng ký khóa học</h1>
                <p className="enroll-sub">Hoàn thành thông tin bên dưới để đăng ký khóa học. Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.</p>
            </header>

            <section className="enroll-grid">
                <aside className="enroll-left">
                    <SummaryCard selectedItem={selectedItem} basePrice={basePrice} />
                </aside>

                <main className="enroll-right">
                    <Card title="Thông tin đăng ký" className="card-right">
                        <form onSubmit={submit} className="form-grid">
                            <label className="p-field">
                                <span>Họ và tên <b className="req">*</b></span>
                                <InputText className="ctrl" value={form.fullName} onChange={(e)=>handleChange('fullName', e.target.value)} placeholder="Nhập họ và tên đầy đủ"/>
                            </label>

                            <label className="p-field">
                                <span>Email <b className="req">*</b></span>
                                <InputText type="email" className="ctrl" value={form.email} onChange={(e)=>handleChange('email', e.target.value)} placeholder="example@email.com"/>
                            </label>

                            <label className="p-field">
                                <span>Số điện thoại <b className="req">*</b></span>
                                <InputText className="ctrl" value={form.phone} onChange={(e)=>handleChange('phone', e.target.value)} placeholder="0123456789"/>
                            </label>

                            <label className="p-field">
                                <span>Ghi chú</span>
                                <InputTextarea className="ctrl" rows={4} value={form.notes} onChange={(e)=>handleChange('notes', e.target.value)} placeholder="Ghi chú thêm về yêu cầu học tập..."/>
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
                                    Tôi đồng ý với <a href="/terms">Điều khoản sử dụng</a> và <a href="/privacy">Chính sách bảo mật</a>.
                                </label>
                            </div>

                            <TotalsBox basePrice={basePrice} discountAmount={discountAmount} totalPay={totalPay} />

                            <Button type="submit" label={loading ? 'Đang xử lý...' : 'Đăng ký ngay'} icon={loading ? '' : 'pi pi-check'} className="btn-submit" disabled={loading}/>
                            {loading && <div className="spin-center"><ProgressSpinner style={{ width: 30, height: 30 }} strokeWidth="4" /></div>}
                        </form>
                    </Card>
                </main>
            </section>
        </div>
    );
}
