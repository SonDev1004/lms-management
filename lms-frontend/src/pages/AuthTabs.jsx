import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import './AuthTabs.css';
import axios from 'axios';

export default function AuthTabs({ onLogin }) {
    const [tab, setTab] = useState('login');
    const toast = useRef(null);
    const navigate = useNavigate();

    // refs for autofocus / accessibility
    const usernameRef = useRef(null);

    // Login state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);

    useEffect(() => {
        const r = localStorage.getItem('rememberUsername');
        if (r) {
            setUsername(r);
            setRemember(true);
        }
    }, []);

    // focus username when switching to login tab
    useEffect(() => {
        if (tab === 'login' && usernameRef.current) {
            usernameRef.current.focus();
        }
    }, [tab]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            toast.current.show({ severity: 'warn', summary: 'Thiếu thông tin', detail: 'Vui lòng nhập username và password', life: 2500 });
            return;
        }
        if (onLogin) {
            await onLogin({ username: username.trim(), password, remember });
            toast.current.show({ severity: 'success', summary: 'Đăng nhập', detail: 'Thành công', life: 1200 });
        } else {
            axios.post('auth/login', { username: username, password: password })
                .then(res => {
                    let { accessToken, refreshToken } = res.data.result;
                    localStorage.setItem('username', username);
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    navigate('/home');
                })
                .catch(err => {
                    toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Đăng nhập thất bại', life: 3500 });
                })
        }
    };

    // Register state
    const [formData, setFormData] = useState({
        firstName: 'Duong',
        lastName: 'Huu Phuoc',
        userName: 'huuphuoc29791',
        password: 'Strong@Pass123',
        confirmPassword: 'Strong@Pass123',
        email: 'huuphuoc29791@gmail.com',
        phone: '0905939947',
        dateOfBirth: '01-01-1991',
        address: 'TPHCM',
        gender: 'true',
        avatar: '',
    });
    const [errors, setErrors] = useState({});
    const [loadingRegister, setLoadingRegister] = useState(false);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));

        // quick inline validation for password confirmation
        if (name === 'confirmPassword' || name === 'password') {
            if (name === 'confirmPassword' && value !== formData.password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
            } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu không khớp' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const validate = () => {
        const errs = {};
        if (!formData.userName) errs.userName = 'Username bắt buộc';
        if (!formData.password) errs.password = 'Password bắt buộc';
        if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp';
        if (!formData.email) errs.email = 'Email bắt buộc';
        return errs;
    };

    const formatDate = (dateObj) => {
        if (!dateObj) return '';
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        axios.post('auth/register', formData)
            .then(res => console.log(res.data))

        // try {
        //     // Replace with your API path

        //     // if (res.ok) {
        //     //     toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đăng ký thành công', life: 2000 });
        //     //     setTimeout(() => setTab('login'), 1000);
        //     // } else {
        //     //     toast.current.show({ severity: 'error', summary: 'Lỗi', detail: result.message || 'Đăng ký thất bại', life: 3000 });
        //     // }
        // } catch (err) {
        //     toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi đăng ký', life: 3000 });
        //     console.error(err);
        // } finally {
        //     setLoadingRegister(false);
        // }
    };

    const handleUpload = (event) => {
        if (event && event.files && event.files.length > 0) handleChange('avatar', event.files[0]);
    };

    const isRegisterDisabled = loadingRegister || !formData.userName || !formData.password || formData.password !== formData.confirmPassword || !formData.email;

    return (
        <div className="auth-wrapper">
            <Toast ref={toast} />
            <div className="auth-card" role="region" aria-labelledby="authTitle">
                <ul className="tab-group" role="tablist">
                    <li className={`tab ${tab === 'signup' ? 'active' : ''}`} role="presentation">
                        <button role="tab" aria-selected={tab === 'signup'} onClick={() => setTab('signup')}>Sign Up</button>
                    </li>
                    <li className={`tab ${tab === 'login' ? 'active' : ''}`} role="presentation">
                        <button role="tab" aria-selected={tab === 'login'} onClick={() => setTab('login')}>Log In</button>
                    </li>
                </ul>

                <div className="tab-content">
                    {/* Signup panel */}
                    <div className="panel" style={{ display: tab === 'signup' ? 'block' : 'none' }}>
                        <h1 id="authTitle" className="auth-title">Sign Up for Free</h1>
                        <form onSubmit={handleRegister} noValidate aria-busy={loadingRegister}>
                            <div className="top-row">
                                <div className="field-wrap">
                                    <InputText id="firstName" placeholder=" " value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} autoComplete="given-name" />
                                    <label htmlFor="firstName">First Name <span className="req">*</span></label>
                                </div>
                                <div className="field-wrap">
                                    <InputText id="lastName" placeholder=" " value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} autoComplete="family-name" />
                                    <label htmlFor="lastName">Last Name <span className="req">*</span></label>
                                </div>
                            </div>

                            <div className="field-wrap">
                                <InputText id="emailR" placeholder=" " value={formData.email} onChange={(e) => handleChange('email', e.target.value)} autoComplete="email" />
                                <label htmlFor="emailR">Email Address <span className="req">*</span></label>
                                {errors.email && <small className="p-error">{errors.email}</small>}
                            </div>

                            <div className="field-wrap">
                                <Password id="password" placeholder=" " value={formData.password} onChange={(e) => handleChange('password', e.target.value)} feedback={false} toggleMask aria-invalid={!!errors.password} />
                                <label htmlFor="password">Set A Password <span className="req">*</span></label>
                                {errors.password && <small className="p-error">{errors.password}</small>}
                            </div>

                            <div className="field-wrap">
                                <Password id="confirmPasswordR" placeholder=" " value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} feedback={false} toggleMask aria-invalid={!!errors.confirmPassword} />
                                <label htmlFor="confirmPasswordR">Confirm Password</label>
                                {errors.confirmPassword && <small className="p-error">{errors.confirmPassword}</small>}
                            </div>

                            <div className="field-wrap">
                                <InputText id="userNameR" placeholder=" " value={formData.userName} onChange={(e) => handleChange('userName', e.target.value)} autoComplete="username" />
                                <label htmlFor="userNameR">Username</label>
                                {errors.userName && <small className="p-error">{errors.userName}</small>}
                            </div>

                            <div className="field-wrap">
                                <InputText id="phoneR" placeholder=" " value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} autoComplete="tel" />
                                <label htmlFor="phoneR">Phone</label>
                            </div>

                            <div className="field-wrap">
                                <Calendar id="dob" placeholder=" " value={formData.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.value)} dateFormat="dd-mm-yy" showIcon />
                                <label htmlFor="dob">Date of Birth</label>
                            </div>

                            <div className="field-wrap">
                                <InputTextarea id="addressR" placeholder=" " value={formData.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} />
                                <label htmlFor="addressR">Address</label>
                            </div>

                            <div className="gender-group">
                                <div className="gender-item">
                                    <RadioButton inputId="male" name="gender" value="true" onChange={(e) => handleChange('gender', e.value)} checked={formData.gender === 'true'} />
                                    <label htmlFor="male" className="gender-label">Male</label>
                                </div>
                                <div className="gender-item">
                                    <RadioButton inputId="female" name="gender" value="false" onChange={(e) => handleChange('gender', e.value)} checked={formData.gender === 'false'} />
                                    <label htmlFor="female" className="gender-label">Female</label>
                                </div>
                            </div>

                            <FileUpload name="avatar" mode="basic" accept="image/*" customUpload auto={false} chooseLabel="Choose Image" className="avatar-upload" uploadHandler={handleUpload} />

                            <div style={{ marginTop: 12 }}>
                                <Button onClick={handleRegister} label="Get Started" className="start-btn p-button-rounded" type="submit" loading={loadingRegister} disabled={isRegisterDisabled} />
                            </div>
                        </form>
                    </div>

                    {/* Login panel */}
                    <div className="panel" style={{ display: tab === 'login' ? 'block' : 'none' }}>
                        <h1 className="auth-title">Welcome Back!</h1>
                        <form onSubmit={handleLogin} noValidate aria-busy={loadingLogin}>
                            <div className="field-wrap">
                                <InputText id="loginEmail" value={username} onChange={(e) => setUsername(e.target.value)} ref={usernameRef} autoComplete="username" />
                                <label htmlFor="loginEmail">Email Address / Username <span className="req">*</span></label>
                            </div>

                            <div className="field-wrap">
                                <Password id="loginPassword" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask autoComplete="current-password" />
                                <label htmlFor="loginPassword">Password <span className="req">*</span></label>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Checkbox inputId="rememberMe" checked={remember} onChange={(e) => setRemember(e.checked)} />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>
                                <div className="links"><a href="#" onClick={(e) => e.preventDefault()} className="forgot-link">Forgot Password?</a></div>
                            </div>

                            <div style={{ marginTop: 16 }} className="actions">
                                <Button type="submit" label="Log In" icon="pi pi-sign-in" loading={loadingLogin} disabled={loadingLogin} className="login-btn" />
                                <Button type="button" label="Create Account" className="p-button-text create-account-btn" onClick={() => setTab('signup')} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
