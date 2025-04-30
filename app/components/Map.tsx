"use client";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import MarkerRenderer from "./MarkerRenderer";
import DirectionsHandler from "./DirectionsHandler";
import { Location } from "../types/location";

type MapProps = {
  onClick: (coords: { lat: number; lng: number }) => void;
  onDistanceCalculated?: (distanceKm: number) => void;
  locations: Location[];
  userLocation: { lat: number; lng: number } | null;
};

export default function Map({
  onClick,
  locations,
  userLocation,
  onDistanceCalculated,
}: MapProps) {
  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const defaultCenter = userLocation || { lat: 41.0082, lng: 28.9784 };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={defaultCenter}
        zoom={10}
        onClick={handleClick}
      >
        <MarkerRenderer locations={locations} userLocation={userLocation} />
        <DirectionsHandler
          locations={locations}
          userLocation={userLocation}
          onDistanceCalculated={onDistanceCalculated}
        />
      </GoogleMap>
    </LoadScript>
  );
}
