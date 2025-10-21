import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Password } from 'primereact/password';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Toast } from 'primereact/toast';

import axiosClient from '@/shared/api/axiosClient.js';

import terms from 'assets/data/terms.json';
import bg from 'assets/images/bg-login.png';
import { AppUrls } from "@/shared/constants/index.js";

const Register = () => {
    // States, hooks and refs
    //// Empty user
    // const [user, setUser] = useState({
    //     userName: '',
    //     password: '',
    //     repassword: '',
    //     email: '',
    //     firstName: '',
    //     lastName: '',
    //     dateOfBirth: '',
    //     address: '',
    //     phone: '',
    //     gender: undefined,
    //     avatar: ''
    // });
    //// Test user
    const [user, setUser] = useState({
        userName: 'nguyenvan1.an_2025',
        password: 'Aa@12345!',
        repassword: 'Aa@12345!',
        email: 'an.nguyen+tes1t@example.com',
        firstName: 'Nguyễn Văn',
        lastName: 'An',
        dateOfBirth: '02/09/1998',     // dd/mm/yyyy
        address: 'Số 12, Đường Lê Lợi, Quận 1, TP. HCM',
        phone: '0912-345-678',         // sẽ được strip còn 0912345678 khi gửi
        gender: true,                  // true = Nam, false = Nữ
        avatar: ''
    });

    const [errors, setErrors] = useState({});
    const [acceptTerms, setAcceptTerms] = useState(false);
    const navigate = useNavigate();
    const userNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const repasswordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const dateOfBirthRef = useRef(null);
    const addressRef = useRef(null);
    const phoneRef = useRef(null);
    const genderRef = useRef(null);
    const toast = useRef(null);
    const registerStepperRef = useRef(null);

    // Functions
    const handleChange = (e) => {
        setErrors({});
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const toStep2 = () => {
        let newErrors = {};
        if (!user.userName.trim()) {
            newErrors.userName = 'Username is required';
        }
        if (!user.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!user.password.trim()) {
            newErrors.password = 'Password is required';
        }
        if (user.password !== user.repassword) {
            newErrors.repassword = 'Password do not match';
        }

        setErrors(newErrors);
        if (newErrors.username) {
            userNameRef.current?.focus();
        } else if (newErrors.email) {
            emailRef.current?.focus();
        } else if (newErrors.password) {
            passwordRef.current?.focus();
        }

        if (Object.keys(newErrors).length > 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please check your information', life: 3000 });
            return;
        }

        registerStepperRef.current.nextCallback();
    }

    const toStep3 = () => {
        let newErrors = {};
        // Check dateOfBirth
        const dobClean = user.dateOfBirth.replace(/\//g, '-');
        const [day, month, year] = dobClean.split('-');
        const dateOfBirth = new Date(`${year}-${month}-${day}`);
        if (isNaN(dateOfBirth.getTime())) {
            newErrors.dateOfBirth = 'Invalid date of birth';
        }

        // Check phone
        if (user.phone !== '') {
            user.phone = user.phone.replace(/-/g, '');
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(user.phone)) {
                newErrors.phone = 'Invalid phone number';
            }
        }

        setErrors(newErrors);
        if (newErrors.dateOfBirth) {
            dateOfBirthRef.current?.focus();
        }
        if (newErrors.phone) {
            phoneRef.current?.focus();
        }

        if (Object.keys(newErrors).length > 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please check your information', life: 3000 });
            return;
        }
        registerStepperRef.current.nextCallback();
    }

    const handleRegister = () => {
        const toYMD = (ddmmyyyy) => {
            if (!ddmmyyyy) return '';
            // nhận cả 01/01/2000 hoặc 01-01-2000
            const [d, m, y] = ddmmyyyy.replace(/\D/g, ' ').trim().split(' ').map(Number);
            if (!d || !m || !y) return '';
            const pad = (n) => String(n).padStart(2, '0');
            return `${y}-${pad(m)}-${pad(d)}`;       // <-- YYYY-MM-DD
        };
        const payload = {
            userName: user.userName?.trim(),
            password: user.password,
            firstName: user.firstName?.trim() || '',
            lastName: user.lastName?.trim() || '',
            dateOfBirth: user.dateOfBirth ? toYMD(user.dateOfBirth) : '',
            address: user.address?.trim() || '',
            gender: typeof user.gender === 'boolean' ? user.gender : null,
            email: user.email?.trim(),
            phone: user.phone,
            avatar: user.avatar || ''
        };

        axiosClient.post(AppUrls.register, payload)
            .then(res => {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration successful. Please log in to continue.', life: 3000 });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
            .catch(error => {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registration failed. Please contact the hotline 19001234 for support.', life: 3000 });
            });
    }

    return (
        <>
            <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Toast ref={toast} />

                <div className='w-full md:w-10 lg:w-5 mx-auto'>
                    <Panel header='Register'>
                        <Stepper ref={registerStepperRef} style={{ flexBasis: '50rem' }}>
                            {/* Step 1: Account Information */}
                            <StepperPanel header='Username'>
                                <div className='grid'>
                                    <div className='field col-6'>
                                        <label htmlFor='userName' className='required'>Username</label>
                                        <InputText
                                            id='userName'
                                            name='userName'
                                            className={errors.userName ? 'p-invalid' : ''}
                                            ref={userNameRef}
                                            value={user.userName}
                                            onChange={handleChange}
                                            autoFocus />
                                        {errors.userName && <small className='p-error'>{errors.userName}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label htmlFor='email' className='required'>Email</label>
                                        <InputText
                                            type='email'
                                            id='email'
                                            name='email'
                                            className={errors.email ? 'p-invalid' : ''}
                                            ref={emailRef}
                                            value={user.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <small className='p-error'>{errors.email}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label className='required' onClick={() => passwordRef.current.focus()}>Mật khẩu</label>
                                        <Password
                                            className={errors.password ? 'p-invalid' : ''}
                                            ref={passwordRef}
                                            value={user.password}
                                            onChange={(e) => {
                                                setErrors({});
                                                setUser({ ...user, password: e.target.value });
                                            }}
                                            promptLabel='Input password'
                                            weakLabel='Weak password'
                                            mediumLabel='Medium password'
                                            strongLabel='Strong password' />
                                        {errors.password && <small className='p-error'>{errors.password}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label htmlFor='repassword' className='required'>Confirm Password</label>
                                        <InputText
                                            type='password'
                                            id='repassword'
                                            name='repassword'
                                            className={errors.repassword ? 'p-invalid' : ''}
                                            ref={repasswordRef}
                                            value={user.repassword}
                                            onChange={handleChange} />
                                        {errors.repassword && <small className='p-error'>{errors.repassword}</small>}
                                    </div>
                                </div>
                                <div className='flex pt-4 justify-content-end'>
                                    <Button label='Next' icon='pi pi-arrow-right' iconPos='right' onClick={toStep2} />
                                </div>
                                <Divider />
                                Already have account? <Link to='/login'>Login</Link>
                            </StepperPanel>
                            {/* Step 2: Contact Information */}
                            <StepperPanel header='Contact'>
                                <div className='grid'>
                                    <div className='field col-6'>
                                        <label htmlFor='firstName'>First & Middle Name</label>
                                        <InputText
                                            id='firstName'
                                            name='firstName'
                                            ref={firstNameRef}
                                            value={user.firstName}
                                            onChange={handleChange}
                                            autoFocus />
                                        {errors.firstName && <small className='p-error'>{errors.firstName}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label htmlFor='lastName'>Last Name</label>
                                        <InputText
                                            type='text'
                                            id='lastName'
                                            name='lastName'
                                            style={{ width: '96%' }}
                                            ref={lastNameRef}
                                            value={user.lastName}
                                            onChange={handleChange}
                                        />
                                        {errors.lastName && <small className='p-error'>{errors.lastName}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label htmlFor='dateOfBirth'>Date of Birth</label>
                                        <InputMask
                                            id='dateOfBirth'
                                            name='dateOfBirth'
                                            className={errors.dateOfBirth ? 'p-invalid' : ''}
                                            ref={dateOfBirthRef}
                                            value={user.dateOfBirth}
                                            onChange={handleChange}
                                            mask="99/99/9999"
                                            placeholder="dd/mm/yyyy"
                                            slotChar="dd/mm/yyyy" />
                                        {errors.dateOfBirth && <small className='p-error'>{errors.dateOfBirth}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label htmlFor='phone'>Phone Number</label>
                                        <InputMask
                                            id='phone'
                                            name='phone'
                                            style={{ width: '96%' }}
                                            className={errors.phone ? 'p-invalid' : ''}
                                            ref={phoneRef}
                                            value={user.phone}
                                            onChange={handleChange}
                                            mask="9999-999-999"
                                            placeholder="9999-999-999"
                                            slotChar="____-___-___" />
                                        {errors.phone && <small className='p-error'>{errors.phone}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label htmlFor='address'>Address</label>
                                        <InputText
                                            type='text'
                                            id='address'
                                            name='address'
                                            ref={addressRef}
                                            value={user.address}
                                            onChange={handleChange} />
                                        {errors.address && <small className='p-error'>{errors.address}</small>}
                                    </div>
                                    <div className='field col-6'>
                                        <label onClick={() => genderRef.current.focus()}>Gender</label>
                                        <Dropdown
                                            options={[{ label: 'Male', value: true }, { label: 'Female', value: false }]}
                                            optionLabel='label'
                                            style={{ width: '96%' }}
                                            ref={genderRef}
                                            name='gender'
                                            value={user.gender}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                                <div className='flex pt-4 justify-content-between'>
                                    <Button label='Back' severity='secondary' icon='pi pi-arrow-left' onClick={() => registerStepperRef.current.prevCallback()} />
                                    <Button label='Next' icon='pi pi-arrow-right' iconPos='right' onClick={toStep3} />
                                </div>
                            </StepperPanel>
                            {/* Step 3: Terms and Conditions */}
                            <StepperPanel header='Terms & Conditions'>
                                <div className='flex flex-column h-12rem'>
                                    <ScrollPanel className='overflow-hidden'>
                                        <div style={{ lineHeight: "1.6", fontSize: "14px", color: "#374151" }}>
                                            <h2>{terms.title}</h2>
                                            <p>
                                                <em>Effective from {terms.effectiveDate}</em>
                                            </p>

                                            {terms.sections.map((section, index) => (
                                                <details key={index} style={{ marginBottom: "10px" }} open>
                                                    <summary style={{ fontWeight: "600", color: "#0b5ed7" }}>
                                                        {section.title}
                                                    </summary>
                                                    <ul style={{ marginTop: "6px" }}>
                                                        {section.content.map((item, i) => (
                                                            <li key={i}>{item}</li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            ))}
                                        </div>
                                    </ScrollPanel>
                                    <div className='flex align-items-center mt-3'>
                                        <Checkbox
                                            id='terms'
                                            onChange={e => setAcceptTerms(e.checked)}
                                            checked={acceptTerms} />
                                        <label htmlFor='terms' className='ml-2'>
                                            I have read and agree to the above terms
                                        </label>
                                    </div>
                                </div>
                                <div className='flex pt-4 justify-content-between'>
                                    <Button label='Back' severity='secondary' icon='pi pi-arrow-left' onClick={() => registerStepperRef.current.prevCallback()} />
                                    <Button label='Register' icon='pi pi-check' iconPos='right' onClick={handleRegister} disabled={!acceptTerms} />
                                </div>
                            </StepperPanel>
                        </Stepper>
                    </Panel>
                </div>
            </div >
        </>
    );
}

export default Register;