"use client";
import { useEffect, useState } from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

import { getOrderedLocations } from "../utils/getOrderedLocations";
import { getDirections } from "../services/MapService";
import { DirectionsHandlerProps } from "../types/props";

export default function DirectionsHandler({
  locations,
  userLocation,
  onDistanceCalculated,
}: DirectionsHandlerProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    const fetchDirections = async () => {
      if (!userLocation || locations.length < 1) return;

      const ordered = getOrderedLocations(userLocation, locations);

      const origin = userLocation;
      const destination = {
        lat: ordered[ordered.length - 1].latitude,
        lng: ordered[ordered.length - 1].longitude,
      };
      const waypoints = ordered.slice(0, -1).map((loc) => ({
        location: { lat: loc.latitude, lng: loc.longitude },
        stopover: true,
      }));

      try {
        const result = await getDirections(origin, destination, waypoints);
        if (result) {
          setDirections(result);

          const legs = result.routes[0].legs;
          const totalMeters = legs.reduce((sum, leg) => sum + (leg.distance?.value || 0), 0);
          const totalKm = totalMeters / 1000;

          onDistanceCalculated?.(totalKm);
        }
      } catch (error) {
        console.error("Directions request failed", error);
      }
    };

    fetchDirections();
  }, [userLocation, locations, onDistanceCalculated]);

  return directions ? <DirectionsRenderer directions={directions} /> : null;
}
