import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';

import axiosClient from 'services/axiosClient';

import bg from 'assets/images/bg-login.png';

const Login = () => {
    // States, hooks and refs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useRef(null);

    // Functions
    const handleLogin = (e) => {
        e.preventDefault();
        axiosClient.post('auth/login', { username, password })
            .then(res => {
                let { accessToken, refreshToken } = res.data.result;
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                navigate('/');
            })
            .catch(err => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Đăng nhập thất bại', life: 3000 });
            })
    }

    return (
        <>
            <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Toast ref={toast} />

                <div className='w-full md:w-8 lg:w-4 mx-auto'>
                    <Panel header='Đăng nhập'>
                        <div className='flex flex-column gap-2 mb-3'>
                            <label htmlFor='username'>Tên đăng nhập</label>
                            <InputText id='username' value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
                        </div>
                        <div className='flex flex-column gap-2 mb-3'>
                            <label htmlFor='password'>Mật khẩu</label>
                            <InputText id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='flex flex-column gap-2 mb-3'>
                            <Button label='Đăng nhập' onClick={handleLogin} />
                        </div>
                        <Divider />
                        <div className='flex justify-content-between'>
                            <div>
                                Chưa có tài khoản? <Link to='/register'>Đăng ký</Link>
                            </div>
                            <div>
                                <Link to='/forgot-password'>Quên mật khẩu?</Link>
                            </div>
                        </div>

                    </Panel>
                </div>
            </div >
        </>
    );
}

export default Login;