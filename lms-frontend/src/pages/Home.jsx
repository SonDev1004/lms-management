import { useState } from 'react';
import { Galleria } from 'primereact/galleria';

import './Home.css'
import { Card } from 'primereact/card';
import 'primeicons/primeicons.css';
import { Link } from 'react-router-dom';
const Home = () => {
    const [images, setImages] = useState([
        'https://mdbcdn.b-cdn.net/img/new/slides/041.webp',
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200',
        'https://images.unsplash.com/photo-1498079022511-d15614cb1c02?w=1200',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200'
    ]);

    const itemTemplate = (item) => {
        return <img src={item} style={{ width: '100%', display: 'block' }} />;
    }

    return (
        <>
            <div className="card py-4">
                {/*Galleria Begin */}
                <Galleria
                    value={images}
                    numVisible={5}
                    circular
                    autoPlay
                    transitionInterval={3000}
                    showItemNavigators
                    showItemNavigatorsOnHover
                    item={(item) => (
                        <img
                            src={item}
                            alt={item.alt}
                            style={{
                                width: '100%',
                                height: '400px',   // chiều cao giống Carousel
                                objectFit: 'contain'
                            }}
                        />
                    )}
                    showThumbnails={false}
                    className="w-screen h-screen"
                />
                <div className="card flex justify-content-center flex-wrap">
                    <Card title="Các chương trình học" className='col-8 text-center'>
                        <div className='grid flex justify-content-center flex-wrap py-4'>
                            <div className='col-3' >
                                <Link to="/course/detail" className='p-button font-bold'>IELTS 4.0</Link>
                            </div>
                            <div className='col-3' >
                                <Link to="/course/detail" className='p-button font-bold'>IELTS 4.0</Link>
                            </div>
                            <div className='col-3' >
                                <Link to="/course/detail" className='p-button font-bold'>IELTS 4.0</Link>
                            </div>
                        </div>
                        <div className='grid flex justify-content-center flex-wrap'>
                            <div className='col-3' >
                                <Link to="/course/detail" className='p-button font-bold'>IELTS 4.0</Link>
                            </div><div className='col-3' >
                                <Link to="/course/detail" className='p-button font-bold'>IELTS 4.0</Link>
                            </div><div className='col-3' >
                                <Link to="/course/detail" className='p-button font-bold'>IELTS 4.0</Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            {/*Galleria End*/}
        </>
    );
}

export default Home;