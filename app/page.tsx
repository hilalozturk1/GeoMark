"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useLocationStore } from "./state/locationStore";

import LocationForm from "./components/LocationForm";

import LocationList from "./components/LocationList";
import type { Location } from "./types/location";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

export default function HomePage() {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#FF0000");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null); 
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

  const locations = useLocationStore((state) => state.locations);
  const addLocation = useLocationStore((state) => state.addLocation);
  const updateLocation = useLocationStore((state) => state.updateLocation);
  
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleAddLocation = () => {
    if (!name || !coordinates.lat || !coordinates.lng) {
      alert("Please provide a name and select a location on the map.");
      return;
    }
    addLocation({
      id: Date.now().toString(),
      name,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      color,
    });
    setName("");
  };

  const handleEditLocation = (location: Location) => {
    setEditMode(true);
    setEditingLocation(location);
    setName(location.name);
    setCoordinates({ lat: location.latitude, lng: location.longitude });
  };

  const handleUpdateLocation = () => {
    if (editingLocation && coordinates.lat !== null && coordinates.lng !== null) {
      updateLocation(editingLocation.id, {
        id: editingLocation.id,
        name,
        color,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });
      setEditMode(false);
      setEditingLocation(null);
      setName("");
    } else {
      alert("Please provide valid coordinates.");
    }
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
            handleAddLocation={handleAddLocation}
            handleUpdateLocation={handleUpdateLocation}
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
