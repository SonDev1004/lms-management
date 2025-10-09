import React from 'react';

export default function ContactCard() {
    return (
        <div className="sp-card">
            <div className="sp-card-title">
                <i className="pi pi-map-marker sp-ic" /> Contact Information
            </div>
            <div className="sp-contact">
                <div className="sp-contact-block">
                    <div className="sp-contact-label">Address</div>
                    <div className="sp-contact-value">123 Main St, City, State 12345</div>
                </div>
                <div className="sp-contact-block">
                    <div className="sp-contact-label">Emergency Contact</div>
                    <div className="sp-contact-value">
                        Jane Smith (Mother)
                        <br />
                        +1 (555) 987-6543
                    </div>
                </div>
            </div>
        </div>
    );
}
