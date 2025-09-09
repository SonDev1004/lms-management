// src/components/GoogleMapView.jsx
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 10.762622, lng: 106.660172 };

const GoogleMapView = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} />
        </LoadScript>
    );
};

export default GoogleMapView;
