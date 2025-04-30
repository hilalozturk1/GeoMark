import { Marker } from "@react-google-maps/api";
import { MarkerRendererProps } from "../types/props";

export default function MarkerRenderer({ locations, userLocation }: MarkerRendererProps) {
  return (
    <>
      {userLocation && <Marker position={userLocation} label="You" />}
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
    </>
  );
}
