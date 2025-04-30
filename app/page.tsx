"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

import { Text, Box, Flex } from "@chakra-ui/react";
import LocationForm from "./components/LocationForm";
import LocationList from "./components/LocationList";

import type { Location } from "./types/location";
import { useMapState } from "./hooks/useMapState";
import { useGeolocation } from "./hooks/useGeolocation";
import { useLocationStore } from "./state/locationStore";
import { handleUpdateLocation, handleAddLocation } from "./utils/locationHandlers";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function HomePage() {
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  const locations = useLocationStore((state) => state.locations);
  const addLocation = useLocationStore((state) => state.addLocation);
  const updateLocation = useLocationStore((state) => state.updateLocation);
  const currentPosition = useGeolocation();
  const {
    name, setName,
    color, setColor,
    editMode, setEditMode,
    editingLocation, setEditingLocation,
    coordinates, setCoordinates,
    resetForm
  } = useMapState();

  const handleEditLocation = (location: Location) => {
    setEditMode(true);
    setEditingLocation(location);
    setName(location.name);
    setCoordinates({ lat: location.latitude, lng: location.longitude });
  };

  return (
    <Box p={4}>
      <Map
        onClick={(coords) => setCoordinates(coords)}
        locations={locations}
        userLocation={currentPosition}
        onDistanceCalculated={(km) => setTotalDistance(km)}
      />

      <Flex mt={4} justify={"space-around"} alignItems={"center"} display={"flex"}>
        <Flex display={"block"} justify="flex-start" alignItems={"center"}>
          <LocationForm
            name={name}
            setName={setName}
            color={color}
            setColor={setColor}
            coordinates={coordinates}
            editMode={editMode}
            handleAddLocation={() =>
              handleAddLocation({
                name,
                coordinates,
                color,
                addLocation,
                reset: resetForm,
              })
            }
            handleUpdateLocation={() =>
              handleUpdateLocation({
                editingLocation,
                name,
                color,
                coordinates,
                updateLocation,
                reset: resetForm,
              })
            }
          />
        </Flex>

        <Flex wrap={"wrap"} display={"flex"} justify="flex-start" gap={4} mt={4}>
          <LocationList locations={locations} handleEditLocation={handleEditLocation} />
        </Flex>
      </Flex>

      {totalDistance !== null && (
        <Box mt={4}>
          <Text fontWeight="bold">Total Distance: {totalDistance.toFixed(2)} km</Text>
        </Box>
      )}
    </Box>
  );
}
