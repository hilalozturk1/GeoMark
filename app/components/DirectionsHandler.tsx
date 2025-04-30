import { useEffect, useState } from "react";
import { DirectionsRenderer } from "@react-google-maps/api";
import { getOrderedLocations } from "../utils/getOrderedLocations";
import { Location } from "../types/location";

type DirectionsHandlerProps = {
  locations: Location[];
  userLocation: { lat: number; lng: number } | null;
  onDistanceCalculated?: (distanceKm: number) => void;
};

export default function DirectionsHandler({
  locations,
  userLocation,
  onDistanceCalculated,
}: DirectionsHandlerProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
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
  }, [userLocation, locations, onDistanceCalculated]);

  return directions ? <DirectionsRenderer directions={directions} /> : null;
}
