import { Location } from "../types/location";
import { haversine } from "./haversine";

export const getOrderedLocations = (
  userLocation: { lat: number; lng: number },
  locations: Location[]
): Location[] => {
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
};
