// Ví dụ: src/components/GoogleMapView.jsx
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 51.508742,
    lng: -0.120850
};

const GoogleMapView = () => {
    useEffect(() => {
        // Tạo script Google Maps
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=myMap";
        script.async = true;
        window.myMap = function () {
            new window.google.maps.Map(document.getElementById("googleMap"), {
                center: { lat: 51.508742, lng: -0.120850 },
                zoom: 5,
            });
        };
        document.body.appendChild(script);
        return () => {
            delete window.myMap;
        };
    }, []);

    return <div id="googleMap" style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMapView;