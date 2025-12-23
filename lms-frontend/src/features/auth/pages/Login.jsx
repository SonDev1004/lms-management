import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import axiosClient from '@/shared/api/axiosClient.js';
import roleToRoute from '@/app/router/roleToRoute.js';


import bg from 'assets/images/bg-login.png';
import { AppUrls } from "@/shared/constants/index.js";

const Login = () => {
    // States, hooks and refs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useRef(null);
    const [showPassword, setShowPassword] = useState(false);


    // Functions
    const handleLogin = (e) => {
        e.preventDefault();
        axiosClient.post(AppUrls.login, { username, password })
            .then(res => {
                let { accessToken, refreshToken } = res.data.result;
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('role', res.data.result.roleName);
                navigate('/');
            })
            .catch(err => {
                console.log("🚀 ~ handleLogin ~ err: ", err.response.data);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to login', life: 3000 });
            })
    }

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role) {
            // Đã đăng nhập, redirect về dashboard tương ứng
            navigate(`/${roleToRoute(role)}`);
        }
    }, [navigate]);
    return (
        <>
            <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Toast ref={toast} />

                <div className='w-full md:w-8 lg:w-4 mx-auto'>
                    <Panel header='Login'>
                        <div className='flex flex-column gap-2 mb-3'>
                            <label htmlFor='username'>Username</label>
                            <InputText id='username' className='max-w-full' value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
                        </div>
                        <div className='flex flex-column gap-2 mb-3'>
                            <label htmlFor='password'>Password</label>
                            <div className="p-inputgroup max-w-full">
                                <InputText
                                    id="password"
                                    className="max-w-full"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"}
                                    severity="secondary"
                                    outlined
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                />
                            </div>
                        </div>
                        <div className='flex flex-column gap-2 mb-3'>
                            <Button label='Login' onClick={handleLogin} />
                        </div>
                        <Divider />
                        <div className='flex justify-content-between'>
                            <div>
                                <Link to='/register'>Register Now</Link>
                            </div>
                            <div>
                                <Link to='/forgot-password'>Forgot Password?</Link>
                            </div>
                        </div>

                    </Panel>
                </div>
            </div >
        </>
    );
}

export default Login;