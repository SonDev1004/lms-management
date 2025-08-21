import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

const home = [
    {
        title: 'C2304L1-NK',
        subtitle: 'Aptech Phong Dao Tao',
        avatarText: 'A',
        headerColor: '#3f51b5',
        avatarColor: '#f4511e',
        description: '',
    },
    {
        title: 'SGIELT573_IELTS INTER...',
        subtitle: 'Anh Ngô Tồng Quốc',
        avatarText: 'A',
        headerColor: '#3f51b5',
        avatarColor: '#5c6bc0',
        description: '',
    },
    {
        title: 'SGIELT576_ IELTS FOU...',
        subtitle: 'Thời gian học (09:00-12:00): Ngân Đặng Hà Thanh',
        avatarText: 'N',
        headerColor: '#5d6d23',
        avatarColor: '#c2185b',
        description: '',
    },
    {
        title: 'ACCP2306+2309_SEM 3',
        subtitle: 'KASE QLĐT',
        avatarText: 'K',
        headerColor: '#3f51b5',
        avatarColor: '#2e4a09',
        description: '',
    },
    {
        title: 'ACCP2306- SEM 2',
        subtitle: 'KASE QLĐT',
        descriptionBold: 'JAVA',
        avatarText: 'K',
        headerColor: '#00897b',
        avatarColor: '#2e4a09',
        description: '',
    },
    {
        title: 'ACCP2306_SEM1',
        subtitle: 'KASE QLĐT',
        avatarText: 'K',
        headerColor: '#37474f',
        avatarColor: '#2e4a09',
        description: '',
    },
    {
        title: '9A-B (2022-2023)',
        subtitle: 'Studyspace TA',
        avatarText: 'S',
        headerColor: '#3f51b5',
        avatarColor: '#8871d0',
        description: '',
    },
    {
        title: 'SGI Extra Class',
        subtitle: 'Example Subtitle',
        avatarText: 'E',
        headerColor: '#ef5350',
        avatarColor: '#0d47a1',
        description: '',
    },
];

const Home = () => {
    return (
        <div className="home-container">
            {home.map((item, index) => (
                <Card key={index} title={item.title} style={{ backgroundColor: item.headerColor }}>
                    <Avatar label={item.avatarText} style={{ backgroundColor: item.avatarColor }} />
                    <h4>{item.subtitle}</h4>
                    <Button label="Details" icon="pi pi-info" />
                </Card>
            ))}
        </div>
    );
};

export default Home;
