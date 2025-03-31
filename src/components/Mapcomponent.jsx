// src/components/MapComponent.jsx
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const libraries = ["places"];
const mapContainerStyle = {
    width: "100%",
    height: "600px",
};
const center = {
    lat:  10.85051590, // Default center (San Francisco)
    lng: 76.27108330,
};

const MapComponent = () => {
    const [hospitals, setHospitals] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const [selectedHospital, setSelectedHospital] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Use Vite environment variable
        libraries,
    });

    useEffect(() => {
        // Fetch hospitals from the backend
        axios.get("https://mini-project-backend-3ao5.onrender.com/hospitals")
            .then((response) => {
                setHospitals(response.data);
            })
            .catch((error) => {
                console.error("Error fetching hospitals:", error);
            });

        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error fetching user location:", error);
                }
            );
        }
    }, []);

    const handleHospitalClick = (hospital) => {
        setSelectedHospital(hospital);
        if (userLocation) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userLocation,
                    destination: { lat: hospital.latitude, lng: hospital.longitude },
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={12}
                center={userLocation || center}
            >
                {userLocation && <Marker position={userLocation} label="You" />}
                {hospitals.map((hospital) => (
                    <Marker
                        key={hospital.id}
                        position={{ lat: hospital.latitude, lng: hospital.longitude }}
                        label={hospital.hospital}
                        onClick={() => handleHospitalClick(hospital)}
                    />
                ))}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
            {selectedHospital && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
                    <h3>{selectedHospital.hospital}</h3>
                    <p>Latitude: {selectedHospital.latitude}</p>
                    <p>Longitude: {selectedHospital.longitude}</p>
                </div>
            )}
        </div>
    );
};

export default MapComponent;