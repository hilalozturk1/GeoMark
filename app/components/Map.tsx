"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type MapProps = {
  onClick: (coords: { lat: number; lng: number }) => void;
  locations: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    color?: string;
  }[];
};

export default function Map({ onClick, locations }: MapProps) {
  const defaultCenter = locations.length
    ? { lat: locations[0].latitude, lng: locations[0].longitude }
    : { lat: 41.0082, lng: 28.9784 };

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onClick({ lat, lng });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={defaultCenter}
        zoom={10}
        onClick={handleClick}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            label={loc.name}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: loc.color || "#FF0000",
              fillOpacity: 1,
              strokeWeight: 1,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
