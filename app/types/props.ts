import { Location } from "./location";

export type MapProps = {
    onClick: (coords: { lat: number; lng: number }) => void;
    onDistanceCalculated?: (distanceKm: number) => void;
    locations: Location[];
    userLocation: { lat: number; lng: number } | null;
};

export type MarkerRendererProps = {
    locations: Location[];
    userLocation: { lat: number; lng: number } | null;
};

export type DirectionsHandlerProps = {
    locations: Location[];
    userLocation: { lat: number; lng: number } | null;
    onDistanceCalculated?: (distanceKm: number) => void;
};

export type LocationFormProps = {
    name: string;
    setName: (value: string) => void;
    color: string;
    setColor: (value: string) => void;
    coordinates: { lat: number | null; lng: number | null };
    editMode: boolean;
    handleAddLocation: () => void;
    handleUpdateLocation: () => void;
};


export interface LocationListProps {
    locations: Location[];
    handleEditLocation: (location: Location) => void;
}
