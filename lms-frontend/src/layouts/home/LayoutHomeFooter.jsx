import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import GoogleMapView from '../GoogleMapView';

const LayoutHomeFooter = () => {
    return (
        <>
            <div className='grid pt-6 pb-6 mt-6' style={{ backgroundColor: 'gray' }}>
                <div className="col-6">
                    <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*ROCi1imT71cQp0FZ.png" alt="" className="w-4" />
                </div>
                <div className="col-6"></div>

                <div className='grid col-12 '>
                    <div className="col-6">
                        <Panel header='Thông tin liên hệ'>
                            <div className="mb-3">
                                <i className="pi pi-facebook"></i> <a href="http://www.facebook.com">http://www.facebook.com</a>
                            </div>
                            <div className="mb-3">
                                <i className="pi pi-phone"></i> <a href="tel:0901234567">0901234567</a>
                            </div>
                            <div className="mb-3">
                                <i className="pi pi-map-marker"></i> <a href=""><span>123 Nguyen Thi Minh Khai</span></a>
                            </div>
                        </Panel>
                    </div>

                    <div className="col-3">
                        <Panel header='Khóa học IELTS'>
                            <div className="mb-3">
                                <a href="">IELTS 4.0</a>
                            </div>
                            <div className="mb-3">
                                <a href="">IELTS 5.0</a>
                            </div>
                            <div className="mb-3">
                                <a href="">IELTS 6.0</a>
                            </div>
                        </Panel>
                    </div>

                    <div className="col-3 ">
                        <GoogleMapView />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LayoutHomeFooter;