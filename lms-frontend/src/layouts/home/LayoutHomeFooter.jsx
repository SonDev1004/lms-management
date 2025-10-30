import { Button } from 'primereact/button';
import GoogleMapView from '../GoogleMapView';

const LayoutHomeFooter = () => {
    return (
        <div className="surface-100 p-4 text-center border-top-1 surface-border">
            <div className="grid">
                <div className="col-12 md:col-4">
                    <h5>Contact</h5>
                    <p className="text-sm">
                        📍 123 ABC Street, District 1, Ho Chi Minh City<br />
                        📞 (028) 1234 5678<br />
                        ✉️ info@educenter.vn
                    </p>
                </div>

                <div className="col-12 md:col-4">
                    <h5>Links</h5>
                    <div className="flex flex-column gap-1">
                        <a href="#" className="text-primary no-underline text-sm">Privacy Policy</a>
                        <a href="#" className="text-primary no-underline text-sm">Terms of Use</a>
                        <a href="#" className="text-primary no-underline text-sm">Payment Guide</a>
                    </div>
                </div>

                <div className="col-12 md:col-4">
                    <h5>Follow Us</h5>
                    <div className="flex justify-content-center md:justify-content-start gap-2">
                        <Button icon="pi pi-facebook" rounded outlined size="small" />
                        <Button icon="pi pi-youtube" rounded outlined size="small" />
                        <Button icon="pi pi-instagram" rounded outlined size="small" />
                    </div>
                </div>
            </div>

            {/* HÀNG BẢN ĐỒ */}
            <div className="grid mt-3">
                <div className="col-12">
                    <div className="border-1 surface-border border-round overflow-hidden" style={{ height: 360 }}>
                        <GoogleMapView />
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-top-1 surface-border">
                <p className="text-sm text-500 m-0">© 2025 EduCenter. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LayoutHomeFooter;
