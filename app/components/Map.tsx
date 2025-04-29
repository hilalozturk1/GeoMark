"use client";
import { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

type Location = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  color?: string;
};

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
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onClick({ lat, lng });
    }
  };

  const defaultCenter = userLocation || { lat: 41.0082, lng: 28.9784 };

  const haversine = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const aa =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.latitude)) *
        Math.cos(toRad(b.latitude)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  };

  const getOrderedLocations = useCallback(() => {
    if (!userLocation || locations.length === 0) return [];

    const visited: Location[] = [];
    const unvisited: Location[] = [...locations];
    let current = { latitude: userLocation.lat, longitude: userLocation.lng };

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let nearestDist = haversine(current, unvisited[0]);

      for (let i = 1; i < unvisited.length; i++) {
        const dist = haversine(current, unvisited[i]);
        if (dist < nearestDist) {
          nearestIdx = i;
          nearestDist = dist;
        }
      }

      const nearest = unvisited.splice(nearestIdx, 1)[0];
      visited.push(nearest);
      current = nearest;
    }

    return visited;
  }, [locations, userLocation]);

  useEffect(() => {
    if (!userLocation || locations.length < 1) return;

    const ordered = getOrderedLocations();

    const origin = userLocation;
    const destination = {
      lat: ordered[ordered.length - 1].latitude,
      lng: ordered[ordered.length - 1].longitude,
    };
    const waypoints = ordered.slice(0, -1).map((loc) => ({
      location: { lat: loc.latitude, lng: loc.longitude },
      stopover: true,
    }));

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);

          const legs = result.routes[0].legs;
          const totalMeters = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
          const totalKm = totalMeters / 1000;

          if (onDistanceCalculated) {
            onDistanceCalculated(totalKm);
          }
        } else {
          console.error("Directions request failed", status);
        }
      }
    );
  }, [userLocation, locations, onDistanceCalculated, getOrderedLocations]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={defaultCenter}
        zoom={10}
        onClick={handleClick}
      >
        {userLocation && (
          <Marker position={userLocation} label="You" />
        )}
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
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
