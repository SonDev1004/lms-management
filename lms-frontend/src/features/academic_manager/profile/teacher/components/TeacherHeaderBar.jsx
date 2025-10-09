import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import StatusTag from './StatusTag';
import { useState } from 'react';

export default function TeacherHeaderBar({ teacher = {}, onEdit, onCopied }) {
    const [copied, setCopied] = useState(null);

    const copy = async (text, key) => {
        try {
            if (!text) return;
            await navigator.clipboard?.writeText(text);
            setCopied(key);
            onCopied?.(key, text);             // cho phép trang cha hiện toast
            setTimeout(() => setCopied(null), 1200);
        } catch {}
    };

    const {
        avatar,
        name = '—',
        title = '',
        status,
        email = '',
        phone = '',
        id = '—',
        department = '—',
        hiredDate,
        employment = '—',
    } = teacher || {};

    return (
        <Card className="tp-header">
            <div className="tp-header-row">
                {/* LEFT */}
                <div className="tp-left">
                    <div className="tp-namewrap">
                        <Avatar
                            image={avatar}
                            icon={!avatar ? 'pi pi-user' : undefined}
                            size="xlarge"
                            shape="circle"
                            className="tp-avatar"
                        />
                        <div>
                            <h2 className="tp-name">{name}</h2>
                            {title && <div className="tp-sub">{title}</div>}

                            <div className="tp-statusline">
                                <StatusTag value={status} />
                                {email && (
                                    <button
                                        type="button"
                                        className={`tp-chip ${copied === 'email' ? 'is-copied' : ''}`}
                                        onClick={() => copy(email, 'email')}
                                        title="Copy email"
                                        aria-label="Copy email"
                                    >
                                        <i className="pi pi-envelope" />
                                        <span className="tp-ellipsis">{email}</span>
                                        {copied === 'email' && <span className="tp-copied">Copied</span>}
                                    </button>
                                )}
                                {phone && (
                                    <button
                                        type="button"
                                        className={`tp-chip ${copied === 'phone' ? 'is-copied' : ''}`}
                                        onClick={() => copy(phone, 'phone')}
                                        title="Copy phone"
                                        aria-label="Copy phone"
                                    >
                                        <i className="pi pi-phone" />
                                        <span>{phone}</span>
                                        {copied === 'phone' && <span className="tp-copied">Copied</span>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="tp-right">
                    <div className="tp-right-top">
                        <Button label="Edit Profile" icon="pi pi-pencil" onClick={onEdit} />
                    </div>

                    <div className="tp-meta">
                        <div className="tp-kv"><span>Teacher ID</span><strong>{id}</strong></div>
                        <div className="tp-kv"><span>Department</span><strong>{department}</strong></div>
                        <div className="tp-kv">
                            <span>Hired</span>
                            <strong>{hiredDate ? new Date(hiredDate).toLocaleDateString() : '—'}</strong>
                        </div>
                        <div className="tp-kv"><span>Employment</span><strong>{employment}</strong></div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
