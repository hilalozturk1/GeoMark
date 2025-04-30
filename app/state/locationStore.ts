import {create} from "zustand";
import { Location } from "../types/location";

interface LocationStore {
  locations: Location[];
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updatedLocation: Partial<Location>) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  addLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),
  updateLocation: (id, updatedLocation) =>
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...loc, ...updatedLocation } : loc
      ),
    })),
}));