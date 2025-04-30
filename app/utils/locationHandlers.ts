import type { Location } from "../types/location";

export const handleAddLocation = ({
  name,
  coordinates,
  color,
  addLocation,
  reset
}: {
  name: string;
  coordinates: { lat: number | null; lng: number | null };
  color: string;
  addLocation: (loc: Location) => void;
  reset: () => void;
}) => {
  if (!name || coordinates.lat == null || coordinates.lng == null) {
    alert("Please provide a name and select a location on the map.");
    return;
  }

  addLocation({
    id: Date.now().toString(),
    name,
    latitude: coordinates.lat,
    longitude: coordinates.lng,
    color
  });

  reset();
};

export const handleUpdateLocation = ({
  editingLocation,
  name,
  color,
  coordinates,
  updateLocation,
  reset,
}: {
  editingLocation: Location | null;
  name: string;
  color: string;
  coordinates: { lat: number | null; lng: number | null };
  updateLocation: (id: string, updated: Location) => void;
  reset: () => void;
}) => {
  if (editingLocation && coordinates.lat !== null && coordinates.lng !== null) {
    updateLocation(editingLocation.id, {
      id: editingLocation.id,
      name,
      color,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
    reset();
  } else {
    alert("Please provide valid coordinates.");
  }
};
